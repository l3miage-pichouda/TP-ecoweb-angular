import { NgIf } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { provideComponentStore } from '@ngrx/component-store';
import { DEFAULT_LIMIT } from '../shared/constants';
import { Article } from '../shared/models';
import { AuthStore } from '../shared/store';
import { ArticleListComponent } from '../shared/ui/article-list';
import { PaginationComponent } from '../shared/ui/pagination';
import { FEED_TYPE, FeedType, HomeStore } from './home.store';
import { FeedToggleComponent } from './ui/feed-toggle/feed-toggle.component';
import { TagsComponent } from './ui/tags/tags.component';

@Component({
  selector: 'app-home',
  imports: [
    TagsComponent,
    FeedToggleComponent,
    NgIf,
    ArticleListComponent,
    PaginationComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideComponentStore(HomeStore)],
})
export default class HomeComponent implements OnInit, AfterViewInit {
  readonly #homeStore = inject(HomeStore);
  readonly #authStore = inject(AuthStore);
  readonly articleCount = this.#homeStore.selectors.articleCount;
  readonly currentOffset = this.#homeStore.selectors.currentOffset;
  readonly isAuthenticated = this.#authStore.selectors.isAuthenticated;
  readonly articleList = this.#homeStore.selectors.articleList;

  @ViewChild('canvasEl') canvasEl!: ElementRef;
  @ViewChild('slides') slides!: ElementRef;

  private context: CanvasRenderingContext2D | null = null;

  slideCount = 0;
  currentIndex = 0;

  ngAfterViewInit() {
    this.context = (
      this.canvasEl.nativeElement as HTMLCanvasElement
    ).getContext('2d');

    this.draw();
    this.slideCount = this.slides.nativeElement.children.length;
    document.querySelector('.next')!.addEventListener('click', () => {
      this.currentIndex = (this.currentIndex + 1) % this.slideCount;
      this.updateSlide();
    });

    document.querySelector('.prev')!.addEventListener('click', () => {
      this.currentIndex =
        (this.currentIndex - 1 + this.slideCount) % this.slideCount;
      this.updateSlide();
    });
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.slideCount;
      this.updateSlide();
    }, 3000);
    setInterval(() => {
      location.reload();
    }, 30_000);
  }

  private draw() {
    const canvas = this.canvasEl.nativeElement as HTMLCanvasElement;
    const ctx = this.context!;
    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = `rgba(${this.randomInt(0, 255)},${this.randomInt(
      0,
      255
    )},${this.randomInt(0, 255)},0.3)`;
    ctx.fillRect(0, 0, width, height);

    ctx.font = '30px Arial';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#000';
    ctx.fillText('Angular Canvas', width / 2, height / 2);

    ctx.beginPath();
    ctx.arc(
      this.randomInt(20, width - 20),
      this.randomInt(20, height - 20),
      this.randomInt(10, 50),
      0,
      Math.PI * 2
    );
    ctx.fillStyle = `rgba(${this.randomInt(0, 255)},${this.randomInt(
      0,
      255
    )},${this.randomInt(0, 255)},0.5)`;
    ctx.fill();
    ctx.closePath();

    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(this.randomInt(0, width), this.randomInt(0, height));
      ctx.lineTo(this.randomInt(0, width), this.randomInt(0, height));
      ctx.strokeStyle = `rgba(${this.randomInt(0, 255)},${this.randomInt(
        0,
        255
      )},${this.randomInt(0, 255)},0.7)`;
      ctx.lineWidth = this.randomInt(1, 5);
      ctx.stroke();
      ctx.closePath();
    }
  }

  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  ngOnInit(): void {
    if (this.isAuthenticated()) {
      this.toggleFeed(FEED_TYPE.yourFeed);
    } else {
      this.toggleFeed(FEED_TYPE.globalFeed);
    }
  }

  selectTag(tag: string): void {
    this.#homeStore.queryArticle({
      feedType: FEED_TYPE.tagFeed,
      params: {
        limit: DEFAULT_LIMIT,
        offset: 0,
        tag,
      },
    });
  }

  toggleFeed(feedType: FeedType): void {
    this.#homeStore.queryArticle({
      feedType,
      params: {
        limit: DEFAULT_LIMIT,
        offset: 0,
      },
    });
  }

  onPageOffsetChange(offset: number): void {
    this.#homeStore.onOffsetChange(offset);
  }

  toggleFavorite(article: Article): void {
    this.#homeStore.toggleFavorite(article);
  }

  updateSlide() {
    this.slides.nativeElement.style.transform = `translateX(-${
      this.currentIndex * 100
    }%)`;
  }
}
