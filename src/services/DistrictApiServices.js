import http from './http-common'

class DistrictApiServices {
  getDistricts() {
    return http.get('/district')
  }
}

export default new DistrictApiServices()
