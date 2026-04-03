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
        this.updateLikesLink(this.core.index);
    }

    private appendLikesIcon(): void {
        if (this.core.outer.find(`.${this.linkClass}`).get()) {
            return;
        }

        this.core.$toolbar.append(
            `<a
                href="#"
                target="_blank"
                rel="noopener"
                aria-label="View likes"
                class="${this.baseLinkClasses.join(' ')}"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart-icon lucide-heart"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            </a>`,
        );
    }

    private bindEvents(): void {
        this.core.LGel.on(`${lGEvents.afterOpen}.likes`, () => {
            this.updateLikesLink(this.core.index);
        });

        this.core.LGel.on(
            `${lGEvents.afterSlide}.likes`,
            (event: CustomEvent<AfterSlideDetail>) => {
                this.updateLikesLink(event.detail.index);
            },
        );

        this.core.LGel.on(`${lGEvents.updateSlides}.likes`, () => {
            this.updateLikesLink(this.core.index);
        });
    }

    private getLikesUrl(index: number): string | undefined {
        const galleryItem = this.core.galleryItems[index];
        const itemLikesUrl =
            galleryItem?.likesUrl ||
            galleryItem?.likeUrl ||
            galleryItem?.shutterpressLikesUrl ||
            galleryItem?.shutterpressGalleryLikesUrl;

        if (itemLikesUrl) {
            return itemLikesUrl;
        }

        const sourceItem = this.core.items?.[index] as HTMLElement | undefined;

        return (
            sourceItem?.getAttribute('data-likes-url') ||
            sourceItem?.getAttribute('data-like-url') ||
            sourceItem?.getAttribute('data-shutterpress-likes-url') ||
            sourceItem?.getAttribute('data-shutterpress-gallery-likes-url') ||
            undefined
        );
    }

    private updateLikesLink(index: number): void {
        const $link = this.core.outer.find(`.${this.linkClass}`).first();
        const link = $link.get() as HTMLAnchorElement | null;

        if (!link) {
            return;
        }

        const likesUrl = this.getLikesUrl(index);

        if (!likesUrl) {
            $link.attr('href', '#');
            $link.addClass('lg-hide');
            link.removeAttribute('data-likes-url');
            return;
        }

        $link.removeClass('lg-hide');
        $link.attr('href', likesUrl);
        $link.attr('data-likes-url', likesUrl);
    }

    destroy(): void {
        this.core.outer.find(`.${this.linkClass}`).remove();
        this.core.LGel.off('.likes');
    }
}
