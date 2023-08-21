import {Component} from 'react'

import {BiSearch} from 'react-icons/bi'

import Loader from 'react-loader-spinner'

import Cookies from 'js-cookie'

import Header from '../Header'

import JobItem from '../JobItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'INPROGRESS',
  failure: 'FAILURE',
}

class Jobs extends Component {
  state = {
    profileDetails: {},
    employmentType: [],
    salaryRange: '',
    search: '',
    jobDetails: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobDetails()
  }

  getProfileDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)

    if (response.ok === true) {
      const data = await response.json()
      const formattedData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      console.log(formattedData)
      this.setState({
        profileDetails: formattedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderProfileDetailsFailureView = () => <button type="button">Retry</button>

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfileDetailsView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProfileDetailsSection()
      case apiStatusConstants.failure:
        return this.renderProfileDetailsFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  getJobDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {employmentType, salaryRange, search} = this.state
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${salaryRange}&search=${search}`
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)

    if (response.ok === true) {
      const data = await response.json()
      const formattedData = data.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))

      this.setState({
        jobDetails: formattedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onChangeEmploymentType = event => {
    console.log(event.target.id)
    const {employmentType} = this.state
    const check = employmentType.find(each => each.includes(event.target.id))
    console.log(check)
    if (check === undefined) {
      this.setState(
        prevstate => ({
          employmentType: [...prevstate.employmentType, event.target.id],
        }),
        this.getJobDetails,
      )
    } else {
      const filteredData = employmentType.filter(
        each => each !== event.target.id,
      )
      this.setState(
        prevstate => ({
          employmentType: [...prevstate.employmentType, filteredData],
        }),
        this.getJobDetails,
      )
    }
  }

  onChangeSalaryRange = salaryRangeId => {
    this.setState({salaryRange: salaryRangeId}, this.getJobDetails)
  }

  renderProfileDetailsSection = () => {
    const {profileDetails} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails
    return (
      <div className="profile-details-container">
        <img src={profileImageUrl} alt="profile" className="profile-image" />
        <h1 className="name">{name}</h1>
        <p className="short-bio">{shortBio}</p>
      </div>
    )
  }

  renderEmploymentDetailsSection = () => {
    const {employmentTypesList} = this.props
    return (
      <ul className="employment-type-list">
        {employmentTypesList.map(each => (
          <li
            key={each.employmentTypeId}
            onChange={this.onChangeEmploymentType}
          >
            <input
              type="checkbox"
              id={each.employmentTypeId}
              className="check-box"
            />
            <label htmlFor={each.employmentTypeId} className="checkbox-label">
              {each.label}
            </label>
          </li>
        ))}
      </ul>
    )
  }

  renderJobsFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button type="button">Retry</button>
    </div>
  )

  renderSalarySection = () => {
    const {salaryRangesList} = this.props
    return (
      <ul className="employment-type-list">
        {salaryRangesList.map(each => (
          <li
            key={each.salaryRangeId}
            onChange={() => this.onChangeSalaryRange(each.salaryRangeId)}
          >
            <input type="radio" id={each.salaryRangeId} className="check-box" />
            <label htmlFor={each.salaryRangeId} className="checkbox-label">
              {each.label}
            </label>
          </li>
        ))}
      </ul>
    )
  }

  renderJobsView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobsSuccessView()
      case apiStatusConstants.failure:
        return this.renderJobsFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  renderJobsSuccessView = () => {
    const {jobDetails} = this.state
    return (
      <ul>
        {jobDetails.map(each => (
          <JobItem JobDetails={each} key={each.id} />
        ))}
      </ul>
    )
  }

  render() {
    return (
      <div className="jobs-route-container">
        <Header />
        <div className="jobs-route">
          <div className="profile-container">
            <button
              className="search-container"
              data-testid="searchButton"
              type="button"
            >
              <input
                type="search"
                className="input-element"
                onChange={this.onChangeSearchInput}
              />
              <div className="search-icon">
                <BiSearch color="#ffffff" />
              </div>
            </button>
            {this.renderProfileDetailsView()}
          </div>
          <hr />
          <h1 className="heading">Type of Employment</h1>
          {this.renderEmploymentDetailsSection()}
          <hr />
          <h1 className="heading">Salary Range</h1>
          {this.renderSalarySection()}
          <hr />

          <div>{this.renderJobsView()}</div>
        </div>
      </div>
    )
  }
}

export default Jobs
