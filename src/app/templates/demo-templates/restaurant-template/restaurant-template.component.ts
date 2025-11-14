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
// const templateSlug = this.route.snapshot.paramMap.get('slug');


//     if (templateSlug) {
//       this.customization.currentTemplateSlug = templateSlug;

//   this.templateService.getTemplateBySlug(templateSlug).subscribe((templateData: any) => {

//   this.customization.loadData(templateData.customizationData);
//   });
//     }

const slug = this.route.snapshot.paramMap.get('slug') 
          || this.route.snapshot.paramMap.get('templateName');

if (slug) {
  this.customization.currentTemplateSlug = slug;
  this.templateService.getTemplateBySlug(slug).subscribe(templateData => {
    this.customization.loadData(templateData.customizationData);
  });
  }
}
}