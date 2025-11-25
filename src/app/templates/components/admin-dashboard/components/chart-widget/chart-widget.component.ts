import {
  Component,
  Input,
  OnInit,
  OnChanges,
  AfterViewInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
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
export class ChartWidgetComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() title: string = '';
  @Input() type: ChartType = 'line';
  @Input() data: ChartConfiguration['data'] | null = null;
  @Input() options: ChartConfiguration['options'] = {};

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  viewReady = false;

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true }
    }
  };

  ngOnInit() {
    if (this.options) {
      this.chartOptions = { ...this.chartOptions, ...this.options };
    }
  }

  ngAfterViewInit() {
    this.viewReady = true;
    if (this.data) {
      setTimeout(() => {
        this.chart!.data = this.data!;
        this.chart!.update();
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.viewReady) return;

    if (changes['data'] && this.chart && this.data) {
      this.chart.data = this.data;
      this.chart.update();
    }
  }
}
