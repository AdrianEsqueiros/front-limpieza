import http from './http-common'

class YearApiServices {
  getYears() {
    return http.get('/year')
  }
}

export default new YearApiServices()
