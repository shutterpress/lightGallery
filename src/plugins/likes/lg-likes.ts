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
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
                    <path fill="currentColor" d="M12 21.35 10.55 20C5.4 15.24 2 12.09 2 8.25 2 5.1 4.42 2.75 7.5 2.75c1.74 0 3.41.81 4.5 2.09 1.09-1.28 2.76-2.09 4.5-2.09 3.08 0 5.5 2.35 5.5 5.5 0 3.84-3.4 6.99-8.55 11.76L12 21.35Z"/>
                </svg>
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
