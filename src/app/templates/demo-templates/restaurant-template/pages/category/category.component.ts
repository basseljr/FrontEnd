import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-category',
  standalone: true,
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit {
  categoryId: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.categoryId = this.route.snapshot.paramMap.get('id');
    console.log('Category ID:', this.categoryId);
  }
}
