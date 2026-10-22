import { VideoInfo } from '../../types';
export type PlayerParams = Record<string, string | number | boolean> | boolean;
export type YouTubeParams = {
    [x: string]: string | number | boolean;
};
export declare const param: (obj: YouTubeParams) => string;
export declare const paramsToObject: (url: string) => YouTubeParams;
export declare const getYouTubeParams: (videoInfo: VideoInfo, youTubePlayerParamsSettings: YouTubeParams | false) => string;
export declare const isYouTubeNoCookie: (url: string) => boolean;
export declare const getVimeoURLParams: (defaultParams: PlayerParams, videoInfo?: VideoInfo) => string;
