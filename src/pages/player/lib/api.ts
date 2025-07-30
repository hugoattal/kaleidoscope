export type TEvent = {
    id: number;
    attributes: {
        banner?: {
            data: {
                attributes: {
                    url: string;
                };
            };
        }
        endAt: number;
        eventType: {
            data: {
                attributes: {
                    defaultBanner: {
                        data: {
                            attributes: {
                                url: string;
                            };
                        };
                    };
                    defaultTitlePrefix: string;
                    defaultTitleSuffix: string;
                };
            };
        };
        startAt: number;
        titlePrefix: string;
        titleSuffix: string;
    };
}
