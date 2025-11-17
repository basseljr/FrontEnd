import { Component } from '@angular/core';
import { HeaderComponent } from "../../../../components/header/header.component";
import { HeroSectionComponent } from "../../../../components/hero-section/hero-section.component";
import { CategorySectionComponent } from "../../../../components/category-section/category-section.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, HeroSectionComponent, CategorySectionComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {}
