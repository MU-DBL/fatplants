import { Component, OnInit, NgZone, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { VisitorAnalyticsService, MonthlyVisitor, LocationVisitor } from 'src/app/services/visitor-analytics/visitor-analytics.service';

// Declare amCharts variables to avoid TypeScript errors
declare var am4core: any;
declare var am4maps: any;
declare var am4geodata_worldLow: any;
declare var am4themes_animated: any;

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit, AfterViewInit, OnDestroy {
  // Make Math available to template
  Math = Math;
  
  // View toggle
  private _showCountryList: boolean = false; // Default to map view
  get showCountryList(): boolean {
    return this._showCountryList;
  }
  set showCountryList(value: boolean) {
    this._showCountryList = value;
    // If switching to map view, ensure map is created
    if (!value) {
      setTimeout(() => {
        this.initializeMap();
      }, 100);
    }
  }
  
  // Reference to the map DOM element
  @ViewChild('worldMap', { static: false }) worldMapDiv: ElementRef;
  
  // amCharts map instance
  private map: any;
  
  // Timeframe selection
  selectedTimeframe: number = 3; // Default to 3 months
  
  // Time-based analytics data
  monthlyData: MonthlyVisitor[] = [];
  filteredMonthlyData: MonthlyVisitor[] = [];
  totalVisitorsInPeriod: number = 0;
  averageMonthlyVisitors: number = 0;
  averageDailyVisitors: number = 0;
  trendPercentage: number = 0;
  peakDay: string = '';
  peakDayVisitors: number = 0;

  // Location-based analytics data
  locationData: LocationVisitor[] = [];
  filteredLocationData: LocationVisitor[] = [];

  // Add a new property for the nested structure
  countryCityMap: { [country: string]: { totalHits: number, cities: { [city: string]: number } } } = {};

  constructor(
    private analyticsService: VisitorAnalyticsService,
    private zone: NgZone
  ) { }

  ngOnInit(): void {
    this.fetchTimeBasedAnalytics();
    this.fetchLocationBasedAnalytics();
  }
  
  ngAfterViewInit(): void {
    // Initialize the chart after data is loaded
    setTimeout(() => {
      if (!this.showCountryList) {
        this.initializeMap();
      }
    }, 1000);
  }
  
  ngOnDestroy(): void {
    // Clean up amCharts when component is destroyed
    this.disposeMap();
  }

  changeTimeframe(months: number): void {
    this.selectedTimeframe = months;
    this.filterDataByTimeframe();
    
    // No need to update map data when timeframe changes
    // as location data is now independent of timeframe
  }
  
  private disposeMap(): void {
    this.zone.runOutsideAngular(() => {
      if (this.map) {
        this.map.dispose();
        this.map = null;
      }
    });
  }
  
  private initializeMap(): void {
    // Ensure any existing map is disposed first
    this.disposeMap();
    
    // Create new map if the element exists
    if (this.worldMapDiv && this.worldMapDiv.nativeElement) {
      this.createWorldMap();
    } else {
      console.warn('Map container element not found');
    }
  }
  
  createWorldMap(): void {
    // This must run outside Angular to prevent performance issues
    this.zone.runOutsideAngular(() => {
      try {
        console.log('Creating world map...');
        
        // Ensure the container is empty
        const container = this.worldMapDiv.nativeElement;
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }
        
        // Enable animated theme
        am4core.useTheme(am4themes_animated);
        
        // Create map instance
        this.map = am4core.create(this.worldMapDiv.nativeElement, am4maps.MapChart);
        
        // Set map definition
        this.map.geodata = am4geodata_worldLow;
        
        // Set projection
        this.map.projection = new am4maps.projections.Miller();
        
        // Create map polygon series
        const polygonSeries = this.map.series.push(new am4maps.MapPolygonSeries());
        polygonSeries.exclude = ["AQ"]; // Exclude Antarctica
        
        // Make map load polygon data from GeoJSON
        polygonSeries.useGeodata = true;
        
        // Configure series
        const polygonTemplate = polygonSeries.mapPolygons.template;
        polygonTemplate.tooltipText = "{name}: {value} visitors";
        polygonTemplate.adapter.add("tooltipText", (text, target) => {
          const countryName = target.dataItem.dataContext.name;
          const countryData = this.filteredLocationData.filter(loc => loc.country === countryName);
          if (countryData.length === 0) return text;
          const totalHits = countryData.reduce((sum, loc) => sum + loc.hits, 0);
          let tooltip = `${countryName}: ${totalHits} visitors\n`;
          tooltip += countryData.map(loc => `${loc.city}: ${loc.hits}`).join('\n');
          return tooltip;
        });
        
        // Set default fill color
        polygonTemplate.fill = am4core.color("#CCCCCC");
        polygonTemplate.stroke = am4core.color("#FFFFFF");
        polygonTemplate.strokeWidth = 0.5;
        
        // Create hover state and set alternative fill color
        const hs = polygonTemplate.states.create("hover");
        hs.properties.fill = am4core.color("#84c209");
        
        // Set up heat rules with proper color scheme
        polygonSeries.heatRules.push({
          property: "fill",
          target: polygonTemplate,
          min: am4core.color("#CCCCCC"),
          max: am4core.color("#629B07"),
          minValue: 0,
          maxValue: 1 // This will be updated in updateMapData
        });
        
        // Data fields
        polygonSeries.dataFields.value = "value";
        polygonSeries.dataFields.id = "id";
        
        // Set up data
        this.updateMapData();
        
        // Add zoom control
        this.map.zoomControl = new am4maps.ZoomControl();
        this.map.zoomControl.slider.height = 100;
        
        // Add home button
        const homeButton = new am4core.Button();
        homeButton.events.on("hit", () => {
          this.map.goHome();
        });
        homeButton.icon = new am4core.Sprite();
        homeButton.icon.path = "M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8";
        homeButton.padding(7, 5, 7, 5);
        homeButton.width = 30;
        homeButton.align = "right";
        homeButton.marginBottom = 10;
        homeButton.parent = this.map.zoomControl;
        homeButton.insertBefore(this.map.zoomControl.plusButton);
        
        // Create a heat legend
        const heatLegend = this.map.createChild(am4maps.HeatLegend);
        heatLegend.series = polygonSeries;
        heatLegend.align = "right";
        heatLegend.valign = "bottom";
        heatLegend.width = am4core.percent(25);
        heatLegend.marginRight = 20;
        heatLegend.marginBottom = 20;
        heatLegend.minValue = 0;
        heatLegend.maxValue = 1; // This will be updated in updateMapData
        
        this.map.events.on("ready", () => {
          this.zone.run(() => {
            console.log("Map ready");
          });
        });
      } catch (error) {
        console.error('Error creating map:', error);
        // Switch to list view if map creation fails
        this.zone.run(() => {
          this._showCountryList = true; // Use private variable to avoid infinite loop
        });
      }
    });
  }
  
  updateMapData(): void {
    if (!this.map) return;
    
    try {
      // Get all country codes from the map data
      const allCountryCodes = this.map.geodata.features.map((feature: any) => ({
        code: feature.id,
        name: feature.properties.name // Get the country name from the map data
      }));
      
      // Create a map of country data with aggregated hits
      const countryDataMap = new Map<string, number>();
      this.filteredLocationData.forEach(location => {
        const currentHits = countryDataMap.get(location.country) || 0;
        countryDataMap.set(location.country, currentHits + location.hits);
      });
      
      // Create data for all countries, including those with 0 visitors
      const mapData = allCountryCodes.map((country: { code: string, name: string }) => {
        return {
          id: country.code,
          name: country.name,
          value: countryDataMap.get(country.name) || 0
        };
      });
      
      // Get the polygon series
      const polygonSeries = this.map.series.getIndex(0);
      if (polygonSeries) {
        polygonSeries.data = mapData;
        
        // Calculate max value for heat rules
        const maxValue = Math.max(...Array.from(countryDataMap.values()));
        
        // Update heat rule
        if (polygonSeries.heatRules && polygonSeries.heatRules.length > 0) {
          polygonSeries.heatRules[0].maxValue = maxValue;
        }
        
        // Update heat legend
        const heatLegend = this.map.children.values.find((child: any) => child instanceof am4maps.HeatLegend);
        if (heatLegend) {
          heatLegend.maxValue = maxValue;
        }
      }
    } catch (error) {
      console.error('Error updating map data:', error);
    }
  }

  filterDataByTimeframe(): void {
    // Filter monthly data
    const monthsToShow = this.selectedTimeframe;
    
    // For demonstration, we'll just use the last X months from our data
    // In a real implementation, you might refetch from the API with the new timeframe
    this.filteredMonthlyData = this.monthlyData.slice(-monthsToShow);
    
    // Calculate total visitors for the selected period
    this.totalVisitorsInPeriod = this.filteredMonthlyData.reduce((sum, item) => sum + item.hits, 0);
    
    // Calculate monthly average
    this.averageMonthlyVisitors = Math.round(this.totalVisitorsInPeriod / this.filteredMonthlyData.length);
    
    // Calculate daily average (assuming 30 days per month for simplicity)
    this.averageDailyVisitors = Math.round(this.totalVisitorsInPeriod / (this.filteredMonthlyData.length * 30));
    
    // Calculate trend percentage (comparing with previous period of same length)
    if (this.monthlyData.length > monthsToShow * 2) {
      const previousPeriodData = this.monthlyData.slice(-monthsToShow * 2, -monthsToShow);
      const previousTotal = previousPeriodData.reduce((sum, item) => sum + item.hits, 0);
      if (previousTotal > 0) {
        this.trendPercentage = Math.round(((this.totalVisitorsInPeriod - previousTotal) / previousTotal) * 100);
      } else {
        this.trendPercentage = 0;
      }
    } else {
      this.trendPercentage = 0;
    }
    
    // Mock peak day data
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    this.peakDay = daysOfWeek[Math.floor(Math.random() * 7)];
    this.peakDayVisitors = Math.round(this.averageDailyVisitors * (1.5 + Math.random()));
    
    // Location-based analytics is now independent of timeframe
    // No need to filter or modify country data based on timeframe
  }

  fetchTimeBasedAnalytics(): void {
    this.analyticsService.getMonthlyVisitors()
      .subscribe(
        data => {
          if (data && data.length > 0) {
            this.monthlyData = data;
          } else {
            // Fallback to mock data if empty response
            this.generateMockMonthlyData();
          }
          this.filterDataByTimeframe();
        }
      );
  }

  fetchLocationBasedAnalytics(): void {
    this.analyticsService.getLocationVisitors()
      .subscribe(data => {
        if (data && data.length > 0) {
          // Build the nested countryCityMap structure
          const map: { [country: string]: { totalHits: number, cities: { [city: string]: number } } } = {};
          data.forEach(entry => {
            if (!map[entry.country]) {
              map[entry.country] = { totalHits: 0, cities: {} };
            }
            if (!map[entry.country].cities[entry.city]) {
              map[entry.country].cities[entry.city] = 0;
            }
            map[entry.country].cities[entry.city] += entry.hits;
            map[entry.country].totalHits += entry.hits;
          });
          this.countryCityMap = map;

          // Flatten for list view: each city as a row, sorted by country and city
          const grouped: LocationVisitor[] = [];
          Object.keys(map).sort().forEach(country => {
            Object.keys(map[country].cities).sort().forEach(city => {
              grouped.push({ country, city, hits: map[country].cities[city] });
            });
          });
          this.locationData = grouped;
          this.filteredLocationData = [...grouped].sort((a, b) => b.hits - a.hits);

          // If you want the world map to use the grouped data:
          if (!this.showCountryList) {
            this.updateMapData();
          }
        } else {
          // Fallback to mock data if empty response
          this.generateMockLocationData();
          this.filteredLocationData = [...this.locationData].sort((a, b) => b.hits - a.hits);
        }
      });
  }

  // Helper methods
  getBarHeight(hits: number, data: MonthlyVisitor[]): number {
    const maxValue = Math.max(...data.map(item => item.hits));
    return maxValue > 0 ? (hits / maxValue) * 100 : 0;
  }

  getCountryBarWidth(hits: number): number {
    const maxHits = Math.max(...this.filteredLocationData.map(location => location.hits));
    return maxHits > 0 ? (hits / maxHits) * 100 : 0;
  }

  private generateMockMonthlyData(): void {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    // Generate last 12 months of data
    const currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    
    this.monthlyData = [];
    
    // Add 24 months of data for trend calculation
    for (let i = 23; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 24) % 12;
      
      // Create a trend where more recent months have higher numbers
      const baseLine = 100 + Math.floor(Math.random() * 50);
      // More recent months get a higher multiplier
      const multiplier = i < 12 ? (1 + (11 - i) * 0.1) : 0.7; 
      
      this.monthlyData.push({
        month_id: monthIndex + 1, // 1-based month_id
        hits: Math.floor(baseLine * multiplier + Math.random() * 100)
      });
    }
    
    // Keep only the last 12 months for display
    this.monthlyData = this.monthlyData.slice(-12);
  }

  private generateMockLocationData(): void {
    this.locationData = [
      { country: 'United States', city: 'New York', hits: 250 },
      { country: 'United States', city: 'San Francisco', hits: 180 },
      { country: 'India', city: 'Mumbai', hits: 300 },
      { country: 'Germany', city: 'Berlin', hits: 150 },
      { country: 'Japan', city: 'Tokyo', hits: 220 }
    ];
  }
} 