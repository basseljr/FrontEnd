import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { ActivatedRoute, RouterOutlet } from "@angular/router";
import { EditPanelComponent } from "../../components/edit-panel/edit-panel.component";
import { HeroSectionComponent } from "../../components/hero-section/hero-section.component";
import { CategorySectionComponent } from "../../components/category-section/category-section.component";
import { CategoryComponent } from "./pages/category/category.component";
import { HomeComponent } from "./pages/home/home.component";
import { TemplatesService } from '../../../core/services/templates.service';
import { CustomizationService } from '../../../core/services/customization.service';
import { TemplateLoaderService } from '../../../core/services/template-loader.service';

@Component({
  selector: 'app-restaurant-template',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, RouterOutlet, EditPanelComponent, HeroSectionComponent, CategorySectionComponent,    HomeComponent],
  templateUrl: './restaurant-template.component.html',
  styleUrls: ['./restaurant-template.component.css']
})


export class RestaurantTemplateComponent implements OnInit {

  constructor(private loader: TemplateLoaderService) {}

  ngOnInit() {
    // Automatically detect if it’s demo or real domain
    this.loader.loadTemplateData();
  }

  onSaveCustomization() {
    // When admin clicks save in edit mode
    this.loader.saveCustomization().subscribe({
      next: () => alert('Customization saved successfully!'),
      error: err => console.error('Save failed', err)
    });
  }
}