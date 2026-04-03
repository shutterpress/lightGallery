import { AfterSlideDetail, lGEvents } from '../../lg-events';
import { LightGallery } from '../../lightgallery';

export default class Likes {
    core: LightGallery;
    static pluginName = 'likes';
    private readonly linkClass = 'lg-likes';
    private readonly baseLinkClasses = ['lg-icon', this.linkClass];

    constructor(instance: LightGallery) {
        this.core = instance;
    }

    init(): void {
        this.appendLikesIcon();
        this.bindEvents();
        this.updateLikesState(this.core.index);
    }

    private appendLikesIcon(): void {
        if (this.core.outer.find(`.${this.linkClass}`).get()) {
            return;
        }

        this.core.$toolbar.append(
            `<button
      type="button"
      aria-label="Toggle like"
      class="${this.baseLinkClasses.join(' ')}"
   >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart-icon lucide-heart"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            </button>`,
        );
    }

    private bindEvents(): void {
        this.core.LGel.on(`${lGEvents.afterOpen}.likes`, () => {
            this.updateLikesState(this.core.index);
        });

        this.core.LGel.on(
            `${lGEvents.afterSlide}.likes`,
            (event: CustomEvent<AfterSlideDetail>) => {
                this.updateLikesState(event.detail.index);
            },
        );

        this.core.LGel.on(`${lGEvents.updateSlides}.likes`, () => {
            this.updateLikesState(this.core.index);
        });
    }

    private updateLikesState(index: number): void {
        const $btn = this.core.outer.find(`.${this.linkClass}`).first();
        if (!$btn.get()) return;

        $btn.removeClass('lg-hide');

        const sourceItem = this.core.items?.[index] as HTMLElement | undefined;
        const imageId = sourceItem?.getAttribute('data-image-id');

        const isLiked =
            !!imageId &&
            !!document.querySelector(
                `.sp-gallery-like-icon[data-image-id="${imageId}"].sp-gallery-liked-image`,
            );

        if (isLiked) {
            $btn.addClass('sp-gallery-liked-image');
        } else {
            $btn.removeClass('sp-gallery-liked-image');
        }
    }

    destroy(): void {
        this.core.outer.find(`.${this.linkClass}`).remove();
        this.core.LGel.off('.likes');
    }
}
