import { LightGallery } from '../../lightgallery';
export default class Proofing {
    core: LightGallery;
    static pluginName: string;
    private readonly buttonClass;
    private readonly statusClassPrefix;
    private readonly baseButtonClasses;
    constructor(instance: LightGallery);
    init(): void;
    private appendProofingIcon;
    private bindEvents;
    private getProofingStatus;
    private updateProofingState;
    destroy(): void;
}
