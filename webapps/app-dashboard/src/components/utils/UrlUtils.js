class UrlUtils{

  static isValidUrl(urlInput){
    if (urlInput === undefined || urlInput === '') return true;
    var urlPattern = new RegExp(
      '^(https?:\\/\\/)?'+
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+
      '((\\d{1,3}\\.){3}\\d{1,3}))'+
      '(\\:\\d+)?'+
      '(\\/[-a-z\\d%@_.~+&:]*)*'+
      '(\\?[;&a-z\\d%@_.,~+&:=-]*)?'+
      '(\\#[-a-z\\d_]*)?$',
      'i'
    );
    return urlPattern.test(urlInput);
  }

  static getYoutubeVideoId(urlInput){
      if (!this.isValidUrl(urlInput)) return '';
      let idKeywordIndex = -1;
      if (urlInput.search("youtube.com\\/")!=-1){
        if (urlInput.search("\\?v=")!=-1){
          idKeywordIndex = urlInput.search("\\?v=")+3;
        }else if (urlInput.search("&v=")!=-1){
          idKeywordIndex = urlInput.search("&v=")+3;
        }else if (urlInput.search("\\/embed\\/")!=-1){
          idKeywordIndex = urlInput.search("\\/embed\\/")+7;
        }
      }
      else if (urlInput.search("youtu.be\\/")!=-1){
        idKeywordIndex = urlInput.search("youtu.be\\/")+9;
      }
      if (idKeywordIndex!=-1){
        let id = urlInput.substring(idKeywordIndex,idKeywordIndex+11);
        if (id.length==11) return id;
      }
      return '';
  }

}

export default UrlUtils;
