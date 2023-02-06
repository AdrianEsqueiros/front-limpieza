import http from './http-common'

class ReportApiServices {
  getGraphicReport(data) {
    return http.post('/report/getGraphicReport', data)
  }
  getGeneralReports() {
    return http.get('/report/getGeneralReport')
  }
  getDetailReport(data) {
    return http.post('/report/getDetailReport', data)
  }
}

export default new ReportApiServices()
