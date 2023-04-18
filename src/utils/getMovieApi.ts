import axios from 'axios';
import dotenv from 'dotenv';
import HttpException from './httpException';

dotenv.config();

interface Movie {
  movieCd: string;
  movieNm: string;
  prdtYear: string;
  production_year: string;
  openDt?: string;
  release_data: string;
  genreAlt: string;
  category: string;
  repNationNm: string;
  directors: string[];
}

interface MovieListResult {
  totCnt: string;
  source: string;
  movieList: Movie[];
}

interface Person {
  peopleNm: string;
  peopleNmEn: string;
}

interface MovieInfo {
  movieCd: string;
  movieNm: string;
  showTm: string;
  directors?: Person[];
  actors?: Person[] | string[];
  staffs?: Person[] | null;
  watchGradeNm: string;
}

interface MovieDetailListResult {
  movieInfoResult: {
    movieInfo: MovieInfo;
    source: string;
  };
}

interface combinedData {
  movie_code: string;
  name: string;
  production_year: string;
  release_data: string;
  category: string;
  region: string;
  director: string[];
  running_time: string;
  actor: string[] | Person[];
  ratings: string;
}

class getMovieApi {
  private readonly movieApiKey: string | undefined;
  private readonly movieApiSecondKey: string | undefined;
  private readonly REGEX =
    /{"movieCd":"\d+\w*"|\s*"movieNm":"[^"]*"|"prdtYear":"\d+"|"openDt":"\d+"|"genreAlt":"[^"]*"|"repNationNm":"[^"]*"|"directors":\[|(?<="peopleNm":)"\W*"(?=})|(?=],)]|(?<=])}(?=,)|(?<=}])}(?=})/g;
  private readonly DETAIL_REGEX = /(?<=ult":){|"showTm":"\w*"|"actors":\[|](?=,"showTy)|(?<=leNm":)"\W*"|"watchGradeNm":"[^"]*"|(?<=회")}/g;

  constructor() {
    this.movieApiKey = process.env.MOVIE_API_KEY;
    this.movieApiSecondKey = process.env.MOVIE_API_SECOND_KEY;
  }

  public getMovieDataList = async (): Promise<MovieListResult[]> => {
    const dataArray: MovieListResult[] = [];

    for (let i = 100; i <= 119; i++) {
      const result = await axios.get(`http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList.json?key=${this.movieApiSecondKey}&curPage=${i}`);
      if (!result) throw new HttpException('MOVIE_DATA_ERROR', 400);
      dataArray.push(result.data);
    }
    return dataArray;
  };

  public parseMovieDataList = async (): Promise<Movie[]> => {
    try {
      const movieDataList = await this.getMovieDataList();
      const regexMovieDataList = JSON.stringify(movieDataList).match(this.REGEX);
      const replaceDataList = regexMovieDataList?.join().replaceAll(',}', '}').replaceAll('[,', '[').replaceAll(',]', ']');
      const result: Movie[] = JSON.parse(`[${replaceDataList}]`);

      return result;
    } catch (err) {
      console.error('DATA_ERROR', err);
      return [];
    }
  };

  public getMovieDetailDataList = async (): Promise<MovieDetailListResult[]> => {
    const movieDataList = await this.parseMovieDataList();
    const movieCodeArray: string[] = movieDataList.map((el) => el.movieCd);
    const result: MovieDetailListResult[] = await Promise.all(
      movieCodeArray.map(async (movieCode) => {
        return (await axios.get(`http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json?key=${this.movieApiSecondKey}&movieCd=${movieCode}`)).data;
      })
    );
    return result;
  };

  public parseMovieDetailDataList = async (): Promise<combinedData[]> => {
    try {
      const movieDetailDataList = (await this.getMovieDetailDataList()).map((movieCode) => {
        const { movieInfo } = movieCode.movieInfoResult;
        delete movieInfo.directors;
        delete movieInfo.staffs;
        return movieCode;
      });
      const regexMovieDetailDataList = JSON.stringify(movieDetailDataList).match(this.DETAIL_REGEX);
      const replaceDetailDataList = regexMovieDetailDataList
        ?.join()
        .replaceAll('{,', '{')
        .replaceAll(',}', '}')
        .replaceAll(',]', ']')
        .replaceAll('[,', '[')
        .replaceAll(',","', ',"')
        .replaceAll(',"]', ']');

      const parseData: MovieInfo[] = JSON.parse(`[${replaceDetailDataList}]`);

      const combinedData: combinedData[] = (await this.parseMovieDataList()).map((movie, index) => ({
        movie_code: movie.movieCd || '',
        name: movie.movieNm || '',
        production_year: movie.prdtYear || '',
        release_data: movie.openDt || '',
        category: movie.genreAlt || '',
        region: movie.repNationNm || '',
        director: movie.directors || [],
        running_time: parseData[index].showTm || '',
        actor: parseData[index].actors || [],
        ratings: parseData[index].watchGradeNm || '',
      }));

      return combinedData;
    } catch (err) {
      console.error('DATA_ERROR', err);
      return [];
    }
  };
}

export default getMovieApi;
