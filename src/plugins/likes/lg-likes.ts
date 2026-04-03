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

        this.core.outer.on('click.likes', (event: Event) => {
            const target = event.target as HTMLElement | null;
            const likeButton = target?.closest(`.${this.linkClass}`);

            if (!likeButton) {
                return;
            }

            event.preventDefault();
            this.toggleLike(this.core.index);
        });
    }

    private getImageId(index: number): string {
        const sourceItem = this.core.items?.[index] as HTMLElement | undefined;

        return (
            sourceItem?.getAttribute('data-image-id') ||
            sourceItem?.dataset?.imageId ||
            ((this.core.galleryItems?.[index] as any)?.imageId ?? '') + ''
        );
    }

    private getLikedState(index: number): {
        imageId: string;
        liked: boolean;
        known: boolean;
    } {
        const sourceItem = this.core.items?.[index] as HTMLElement | undefined;
        const imageId = this.getImageId(index);
        const galleryItem = this.core.galleryItems?.[index] as
            | { liked?: boolean | number | string; isLiked?: boolean | number | string }
            | undefined;

        if (
            imageId &&
            document.querySelector(
                `.sp-gallery-item-${imageId}.sp-gallery-item-liked`,
            )
        ) {
            return { imageId, liked: true, known: true };
        }

        const likedAttr =
            sourceItem?.getAttribute('data-liked') ?? null;

        if (likedAttr === '1') {
            return { imageId, liked: true, known: true };
        }

        if (likedAttr === '0') {
            return { imageId, liked: false, known: true };
        }

        if (
            galleryItem &&
            (galleryItem.liked !== undefined || galleryItem.isLiked !== undefined)
        ) {
            const likedValue =
                galleryItem.liked !== undefined
                    ? galleryItem.liked
                    : galleryItem.isLiked;

            return {
                imageId,
                liked:
                    likedValue === true ||
                    likedValue === 1 ||
                    likedValue === '1',
                known: true,
            };
        }

        return { imageId, liked: false, known: false };
    }

    private getGalleryLikeIcon(imageId: string): HTMLElement | null {
        if (!imageId) {
            return null;
        }

        return document.querySelector(
            `.sp-gallery-like-icon[data-image-id="${imageId}"]`,
        );
    }

    private toggleLike(index: number): void {
        const imageId = this.getImageId(index);
        const galleryLikeIcon = this.getGalleryLikeIcon(imageId);

        if (!galleryLikeIcon) {
            this.updateLikesState(index);
            return;
        }

        galleryLikeIcon.dispatchEvent(
            new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window,
            }),
        );

        this.updateLikesState(index);
        window.setTimeout(() => this.updateLikesState(index), 60);
        window.setTimeout(() => this.updateLikesState(index), 180);
        window.setTimeout(() => this.updateLikesState(index), 320);
    }

    private updateLikesState(index: number): void {
        const $btn = this.core.outer.find(`.${this.linkClass}`).first();
        if (!$btn.get()) return;

        $btn.removeClass('lg-hide');
        const likedState = this.getLikedState(index);

        if (likedState.imageId) {
            $btn.attr('data-image-id', likedState.imageId);
        }

        if (likedState.liked) {
            $btn.addClass('sp-gallery-liked-image');
        } else if (likedState.known) {
            $btn.removeClass('sp-gallery-liked-image');
        }
    }

    destroy(): void {
        this.core.outer.find(`.${this.linkClass}`).remove();
        this.core.LGel.off('.likes');
    }
}
