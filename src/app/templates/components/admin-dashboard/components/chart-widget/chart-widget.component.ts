import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-chart-widget',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './chart-widget.component.html',
  styleUrls: ['./chart-widget.component.css']
})
export class ChartWidgetComponent implements OnInit {
  @Input() title: string = '';
  @Input() type: ChartType = 'line';
  @Input() data: ChartConfiguration['data'] | null = null;
  @Input() options: ChartConfiguration['options'] = {};

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    }
  };

  ngOnInit() {
    if (this.options) {
      this.chartOptions = { ...this.chartOptions, ...this.options };
    }
  }
}

