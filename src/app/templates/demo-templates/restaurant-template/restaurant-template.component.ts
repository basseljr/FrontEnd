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

@Component({
  selector: 'app-restaurant-template',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, RouterOutlet, EditPanelComponent, HeroSectionComponent, CategorySectionComponent,    HomeComponent],
  templateUrl: './restaurant-template.component.html',
  styleUrls: ['./restaurant-template.component.css']
})
export class RestaurantTemplateComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private templateService: TemplatesService,
    private customization: CustomizationService
  ) {}

  ngOnInit() {


  //     const host = window.location.hostname; // e.g. client1.aiw.com or localhost
  // const isLocal = host.includes('localhost');

  // if (!isLocal) {
  //   this.templateService.getTemplateByDomain().subscribe(data => {
  //     this.customization.loadData(data.customizationData);
  //   });
  // } else {
  //   // fallback: use slug from route (for local testing)
  //   const slug = this.route.snapshot.paramMap.get('slug');
  //   if (slug) {
  //     this.templateService.getTemplateBySlug(slug).subscribe(data => {
  //       this.customization.loadData(data.customizationData);
  //     });
  //   }
  // }

const host = window.location.hostname;
  const isLocal = host === 'localhost';  

  const parts = host.split('.');
  const subdomain = parts.length > 1 && parts[0] !== 'localhost' ? parts[0] : null;

  if (!isLocal && subdomain) {
    this.templateService.getTemplateByDomain(subdomain).subscribe(data => {
      this.customization.loadData(data.customizationData);
      console.log('Loaded customization by domain:', subdomain);
    });
  } else {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.templateService.getTemplateBySlug(slug).subscribe(data => {
        this.customization.loadData(data.customizationData);
        console.log('Loaded customization by slug:', slug);
      });
    }
  }
} 
}