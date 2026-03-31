import { AfterSlideDetail, lGEvents } from '../../lg-events';
import { LightGallery } from '../../lightgallery';

export default class Proofing {
    core: LightGallery;
    static pluginName = 'proofing';
    private readonly buttonClass = 'lg-proofing';
    private readonly statusClassPrefix = 'lg-proofing-status-';
    private readonly baseButtonClasses = ['lg-icon', this.buttonClass];

    constructor(instance: LightGallery) {
        this.core = instance;
    }

    init(): void {
        this.appendProofingIcon();
        this.bindEvents();
        this.updateProofingState(this.core.index);
    }

    private appendProofingIcon(): void {
        if (this.core.outer.find(`.${this.buttonClass}`).get()) {
            return;
        }

        this.core.$toolbar.append(
            `<button type="button" aria-label="Proofing status" class="${this.baseButtonClasses.join(
                ' ',
            )}">
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
                    <path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 1.9.77 3.62 2 4.89V22l5-2.5L17 22v-8.11A6.97 6.97 0 0 0 19 9a7 7 0 0 0-7-7Zm0 2a5 5 0 0 1 5 5c0 1.35-.53 2.58-1.4 3.47l-.6.58V18.76l-3-1.5-3 1.5v-5.71l-.6-.58A4.97 4.97 0 0 1 7 9a5 5 0 0 1 5-5Z"/>
                </svg>
            </button>`,
        );
    }

    private bindEvents(): void {
        this.core.LGel.on(`${lGEvents.afterOpen}.proofing`, () => {
            this.updateProofingState(this.core.index);
        });

        this.core.LGel.on(
            `${lGEvents.afterSlide}.proofing`,
            (event: CustomEvent<AfterSlideDetail>) => {
                this.updateProofingState(event.detail.index);
            },
        );

        this.core.LGel.on(`${lGEvents.updateSlides}.proofing`, () => {
            this.updateProofingState(this.core.index);
        });
    }

    private getProofingStatus(index: number): string | undefined {
        const galleryItem = this.core.galleryItems[index];
        const itemStatus = galleryItem?.proofingStatus;
        if (itemStatus) {
            return itemStatus;
        }

        const sourceItem = this.core.items?.[index] as HTMLElement | undefined;
        return sourceItem?.getAttribute('data-proofing-status') || undefined;
    }

    private updateProofingState(index: number): void {
        const $button = this.core.outer.find(`.${this.buttonClass}`).first();
        const button = $button.get();

        if (!button) {
            return;
        }

        const classNames = Array.from(button.classList);
        classNames.forEach((className) => {
            if (className.indexOf(this.statusClassPrefix) === 0) {
                $button.removeClass(className);
            }
        });

        const status = this.getProofingStatus(index);
        if (!status) {
            button.removeAttribute('data-proofing-status');
            return;
        }

        const normalizedStatus = status
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

        if (!normalizedStatus) {
            return;
        }

        $button.addClass(`${this.statusClassPrefix}${normalizedStatus}`);
        $button.attr('data-proofing-status', status);
    }

    destroy(): void {
        this.core.outer.find(`.${this.buttonClass}`).remove();
        this.core.LGel.off('.proofing');
    }
}
