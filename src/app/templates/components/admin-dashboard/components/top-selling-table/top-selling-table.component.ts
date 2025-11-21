import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopItem } from '../../../../../core/models/analytics.model';

@Component({
  selector: 'app-top-selling-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-selling-table.component.html',
  styleUrls: ['./top-selling-table.component.css']
})
export class TopSellingTableComponent {
  @Input() items: TopItem[] = [];
}

