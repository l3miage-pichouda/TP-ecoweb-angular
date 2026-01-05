import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ArticleService } from 'src/app/shared/services';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private readonly articleService = inject(ArticleService);
  ngOnInit(): void {
    this.articleService
      .getArticleGlobal({
        limit: 30,
        offset: 0,
      })
      .subscribe();
  }
}
