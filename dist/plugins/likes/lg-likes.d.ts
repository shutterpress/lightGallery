import { LightGallery } from '../../lightgallery';
export default class Likes {
    core: LightGallery;
    static pluginName: string;
    private readonly linkClass;
    private readonly baseLinkClasses;
    constructor(instance: LightGallery);
    init(): void;
    private appendLikesIcon;
    private bindEvents;
    private getImageId;
    private getLikedState;
    private getGalleryLikeIcon;
    private toggleLike;
    private updateLikesState;
    destroy(): void;
}
