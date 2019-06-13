interface ImageResolvedAssetSource {
  uri: string;
}

// tslint:disable-next-line
export const Image = {
  resolveAssetSource: (resourceId: string|number): ImageResolvedAssetSource => {
    return {
      uri: `http://localhost/assets/${resourceId}`,
    };
  }
};
