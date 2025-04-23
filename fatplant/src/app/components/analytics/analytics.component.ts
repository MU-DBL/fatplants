import { Component, OnInit, NgZone, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { VisitorAnalyticsService, MonthlyVisitor, CountryVisitor } from 'src/app/services/visitor-analytics/visitor-analytics.service';

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
  countryData: CountryVisitor[] = [];
  filteredCountryData: CountryVisitor[] = [];

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
    
    // Update map if it's active
    if (!this.showCountryList && this.map) {
      this.updateMapData();
    }
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
        polygonTemplate.fill = am4core.color("#CCCCCC");
        polygonTemplate.stroke = am4core.color("#FFFFFF");
        polygonTemplate.strokeWidth = 0.5;
        
        // Create hover state and set alternative fill color
        const hs = polygonTemplate.states.create("hover");
        hs.properties.fill = am4core.color("#84c209");
        
        // Set up heat rules
        polygonSeries.heatRules.push({
          property: "fill",
          target: polygonTemplate,
          min: am4core.color("#CCCCCC"),
          max: am4core.color("#629B07"),
          maxValue: Math.max(...this.filteredCountryData.map(country => country.count))
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
        heatLegend.maxValue = Math.max(...this.filteredCountryData.map(country => country.count));
        
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
      const mapData = this.filteredCountryData.map(country => ({
        id: country.code,
        name: country.name,
        value: country.count
      }));
      
      // Get the polygon series
      const polygonSeries = this.map.series.getIndex(0);
      if (polygonSeries) {
        polygonSeries.data = mapData;
        
        // Update heat rule
        if (polygonSeries.heatRules && polygonSeries.heatRules.length > 0) {
          polygonSeries.heatRules[0].maxValue = Math.max(...this.filteredCountryData.map(country => country.count));
        }
        
        // Update heat legend
        const heatLegend = this.map.children.values.find((child: any) => child instanceof am4maps.HeatLegend);
        if (heatLegend) {
          heatLegend.maxValue = Math.max(...this.filteredCountryData.map(country => country.count));
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
    this.totalVisitorsInPeriod = this.filteredMonthlyData.reduce((sum, item) => sum + item.count, 0);
    
    // Calculate monthly average
    this.averageMonthlyVisitors = Math.round(this.totalVisitorsInPeriod / this.filteredMonthlyData.length);
    
    // Calculate daily average (assuming 30 days per month for simplicity)
    this.averageDailyVisitors = Math.round(this.totalVisitorsInPeriod / (this.filteredMonthlyData.length * 30));
    
    // Calculate trend percentage (comparing with previous period of same length)
    if (this.monthlyData.length > monthsToShow * 2) {
      const previousPeriodData = this.monthlyData.slice(-monthsToShow * 2, -monthsToShow);
      const previousTotal = previousPeriodData.reduce((sum, item) => sum + item.count, 0);
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
    
    // Filter country data - in a real implementation, you would refetch from API
    // For now, we'll just recalculate the visitor counts based on the timeframe
    const timeframeFactor = monthsToShow / 12; // Adjust country data based on timeframe
    this.filteredCountryData = this.countryData.map(country => ({
      ...country,
      count: Math.round(country.count * timeframeFactor)
    }));
    
    // Re-sort to ensure highest counts are first
    this.filteredCountryData.sort((a, b) => b.count - a.count);
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
    this.analyticsService.getCountryVisitors()
      .subscribe(
        data => {
          if (data && data.length > 0) {
            this.countryData = data;
          } else {
            // Fallback to mock data if empty response
            this.generateMockCountryData();
          }
          this.filterDataByTimeframe();
        }
      );
  }

  // Helper methods
  getBarHeight(count: number, data: MonthlyVisitor[]): number {
    const maxValue = Math.max(...data.map(item => item.count));
    return maxValue > 0 ? (count / maxValue) * 100 : 0;
  }

  getCountryBarWidth(count: number): number {
    const maxCount = Math.max(...this.filteredCountryData.map(country => country.count));
    return maxCount > 0 ? (count / maxCount) * 100 : 0;
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
        month: months[monthIndex],
        count: Math.floor(baseLine * multiplier + Math.random() * 100)
      });
    }
    
    // Keep only the last 12 months for display
    this.monthlyData = this.monthlyData.slice(-12);
  }

  private generateMockCountryData(): void {
    // Sample country data for development purposes
    this.countryData = [
      { name: 'United States', count: 1245, code: 'US' },
      { name: 'China', count: 890, code: 'CN' },
      { name: 'India', count: 756, code: 'IN' },
      { name: 'United Kingdom', count: 543, code: 'GB' },
      { name: 'Germany', count: 498, code: 'DE' },
      { name: 'France', count: 387, code: 'FR' },
      { name: 'Canada', count: 345, code: 'CA' },
      { name: 'Australia', count: 301, code: 'AU' },
      { name: 'Japan', count: 289, code: 'JP' },
      { name: 'Brazil', count: 245, code: 'BR' },
      { name: 'South Korea', count: 201, code: 'KR' },
      { name: 'Russia', count: 189, code: 'RU' },
      { name: 'Spain', count: 176, code: 'ES' },
      { name: 'Italy', count: 165, code: 'IT' },
      { name: 'Mexico', count: 142, code: 'MX' },
      { name: 'Indonesia', count: 135, code: 'ID' },
      { name: 'Netherlands', count: 128, code: 'NL' },
      { name: 'Turkey', count: 120, code: 'TR' },
      { name: 'Switzerland', count: 115, code: 'CH' },
      { name: 'Saudi Arabia', count: 110, code: 'SA' },
      { name: 'Sweden', count: 98, code: 'SE' },
      { name: 'Poland', count: 95, code: 'PL' },
      { name: 'Belgium', count: 92, code: 'BE' },
      { name: 'Thailand', count: 85, code: 'TH' },
      { name: 'Argentina', count: 82, code: 'AR' },
      { name: 'Austria', count: 78, code: 'AT' },
      { name: 'Norway', count: 76, code: 'NO' },
      { name: 'Denmark', count: 72, code: 'DK' },
      { name: 'Malaysia', count: 68, code: 'MY' },
      { name: 'Singapore', count: 65, code: 'SG' }
    ];
  }
} 