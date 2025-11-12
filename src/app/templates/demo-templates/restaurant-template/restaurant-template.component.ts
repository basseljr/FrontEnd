import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { RouterOutlet } from "@angular/router";
import { EditPanelComponent } from "../../components/edit-panel/edit-panel.component";
import { HeroSectionComponent } from "../../components/hero-section/hero-section.component";
import { CategorySectionComponent } from "../../components/category-section/category-section.component";
import { CategoryComponent } from "./pages/category/category.component";
import { HomeComponent } from "./pages/home/home.component";

@Component({
  selector: 'app-restaurant-template',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, RouterOutlet, EditPanelComponent, HeroSectionComponent, CategorySectionComponent,    HomeComponent],
  templateUrl: './restaurant-template.component.html',
  styleUrls: ['./restaurant-template.component.css']
})
export class RestaurantTemplateComponent {

  
}
