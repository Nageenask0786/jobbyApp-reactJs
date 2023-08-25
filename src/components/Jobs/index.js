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
    apiJobsStatus: apiStatusConstants.initial,
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
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  getJobDetails = async () => {
    this.setState({apiJobsStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {employmentType, salaryRange, search} = this.state
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${salaryRange}&search=${search}`
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()

    if (response.ok === true) {
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
        apiJobsStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiJobsStatus: apiStatusConstants.failure,
      })
    }
  }

  onChangeSearchInput = event => {
    this.setState({search: event.target.value})
  }

  onChangeSalaryRange = event => {
    this.setState({salaryRange: event.target.id}, this.getJobDetails)
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

  renderProfileDetailsSection = () => {
    const {profileDetails} = this.state
    return (
      <div className="profile-details-container">
        <img
          src={profileDetails.profileImageUrl}
          alt="profile"
          className="profile-image"
        />
        <h1 className="name">{profileDetails.name}</h1>
        <p className="short-bio">{profileDetails.shortBio}</p>
      </div>
    )
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onRetryProfile = () => {
    this.getProfileDetails()
  }

  renderProfileFailureView = () => (
    <button
      className="retry-button"
      type="button"
      onClick={this.onRetryProfile}
    >
      Retry
    </button>
  )

  renderProfileOutput = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProfileDetailsSection()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.failure:
        return this.renderProfileFailureView()
      default:
        return null
    }
  }

  onRetryJobs = () => {
    this.getJobDetails()
  }

  renderJobsFailureView = () => (
    <div className="jobs-failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1 className="heading">Oops! Something Went Wrong</h1>
      <p className="description">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" onClick={this.onRetryJobs} className="retry-button">
        Retry
      </button>
    </div>
  )

  renderNoJobsView = () => (
    <div className="jobs-failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="no-jobs-image"
      />
      <h1 className="heading">No Jobs Found</h1>
      <p className="description">
        We could not find any jobs. Try other filters.
      </p>
    </div>
  )

  renderJobsSuccessView = () => {
    const {jobDetails} = this.state
    return (
      <>
        {jobDetails.length > 0 ? (
          <ul>
            {jobDetails.map(each => (
              <JobItem JobDetails={each} key={each.id} />
            ))}
          </ul>
        ) : (
          this.renderNoJobsView()
        )}
      </>
    )
  }

  renderJobsView = () => {
    const {apiJobsStatus} = this.state
    switch (apiJobsStatus) {
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

  renderEmploymentDetailsSection = () => {
    const {employmentTypesList} = this.props
    return (
      <ul className="employment-type-list">
        {employmentTypesList.map(each => (
          <li
            className="employment-items"
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

  renderSalarySection = () => {
    const {salaryRangesList} = this.props
    return (
      <ul className="employment-type-list">
        {salaryRangesList.map(each => (
          <li
            className="employment-items"
            key={each.salaryRangeId}
            onChange={this.onChangeSalaryRange}
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

  onSubmitSearch = () => {
    this.getJobDetails()
  }

  onClickEnter = event => {
    if (event.target.value === 'Enter') {
      this.getJobDetails()
    }
  }

  render() {
    const {search} = this.state
    return (
      <div className="jobs-route-container">
        <Header />
        <div className="search-container">
          <input
            type="search"
            className="input-element"
            onChange={this.onChangeSearchInput}
            onKeyDown={this.onClickEnter}
            value={search}
            placeholder="Search"
          />
          <button
            type="button"
            className="search-icon"
            onClick={this.onSubmitSearch}
            data-testid="searchButton"
          >
            <BiSearch color="#ffffff" />
          </button>
        </div>

        <div className="jobs-route">
          <div className="side-bar">
            <div className="profile-container">
              {this.renderProfileOutput()}
            </div>
            <hr />
            <h1 className="heading">Type of Employment</h1>
            {this.renderEmploymentDetailsSection()}
            <hr />
            <h1 className="heading">Salary Range</h1>
            {this.renderSalarySection()}
            <hr />
          </div>
          <div className="jobs-view">{this.renderJobsView()}</div>
        </div>
      </div>
    )
  }
}

export default Jobs
