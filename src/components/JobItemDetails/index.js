import {Component} from 'react'

import Cookies from 'js-cookie'

import {BsFillBriefcaseFill} from 'react-icons/bs'

import {MdLocationOn} from 'react-icons/md'

import {AiFillStar} from 'react-icons/ai'

import Loader from 'react-loader-spinner'

import Header from '../Header'

import SkillItem from '../SkillItem'

import SimilarJobs from '../SimilarJobs'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'INPROGRESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {
    jobItemDetails: {},
    similarJobsData: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobItemDetails()
  }

  changeToCamelCase = data => {
    const jobDetails = data.job_details
    const updatedJobDetails = {
      title: jobDetails.title,
      companyLogoUrl: jobDetails.company_logo_url,
      companyWebsiteUrl: jobDetails.company_website_url,
      employmentType: jobDetails.employment_type,
      id: jobDetails.id,
      jobDescription: jobDetails.job_description,
      skills: jobDetails.skills.map(each => ({
        imageUrl: each.image_url,
        name: each.name,
      })),
      lifeAtCompany: {
        description: jobDetails.life_at_company.description,
        imageUrl: jobDetails.life_at_company.image_url,
      },
      location: jobDetails.location,
      packagePerAnnum: jobDetails.package_per_annum,
      rating: jobDetails.rating,
    }
    const similarJobs = data.similar_jobs
    const similarJobDetails = similarJobs.map(each => ({
      companyLogoUrl: each.company_logo_url,
      employmentType: each.employment_type,
      jobDescription: each.job_description,
      location: each.location,
      rating: each.rating,
      title: each.title,
      id: each.id,
    }))
    return {updatedJobDetails, similarJobDetails}
  }

  getJobItemDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(apiUrl, options)

    if (response.ok === true) {
      const data = await response.json()
      const details = this.changeToCamelCase(data)
      const {updatedJobDetails, similarJobDetails} = details
      this.setState({
        jobItemDetails: updatedJobDetails,
        similarJobsData: similarJobDetails,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderJoBItemDetailsSuccessView = () => {
    const {jobItemDetails, similarJobsData} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      title,
      rating,
      location,
      employmentType,
      packagePerAnnum,
      jobDescription,

      skills,
      lifeAtCompany,
    } = jobItemDetails
    console.log(lifeAtCompany)
    const isSkillsDefined = skills !== undefined
    const isLifeatCompanyDefined = lifeAtCompany !== undefined
    const similarJobsDefined = similarJobsData !== undefined
    return (
      <div className="job-item-details-route">
        <div className="job-item-details">
          <div className="company-logo-container2">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company-logo2"
            />

            <div className="company-details2">
              <h1 className="title2">{title}</h1>
              <div className="rating-container2">
                <AiFillStar color="#fbbf24" />
                <p className="rating2">{rating}</p>
              </div>
            </div>
          </div>
          <div className="flex">
            <div className="job-location-details">
              <MdLocationOn className="width2" />
              <p className="location2">{location}</p>

              <BsFillBriefcaseFill className="width2" />
              <p className="employment-type2">{employmentType}</p>
            </div>
            <div className="package-container">
              <p className="package">{packagePerAnnum}</p>
            </div>
          </div>

          <hr />
          <div className="flex">
            <h1 className="description-text2">Description</h1>
            <a href={companyWebsiteUrl} target="_blank" rel="noreferrer">
              Visit
            </a>
          </div>
          <p className="description2">{jobDescription}</p>
          <h1 className="skills">Skills</h1>
          <ul className="skill-item-container">
            {isSkillsDefined &&
              skills.map(each => (
                <SkillItem skillsDetails={each} key={each.name} />
              ))}
          </ul>
          <h1 className="life-at-company-text">Life at Company</h1>
          {isLifeatCompanyDefined && (
            <div>
              <p className="life-at-company">{lifeAtCompany.description}</p>
              <img
                src={lifeAtCompany.imageUrl}
                alt="life at company"
                className="image"
              />
            </div>
          )}
        </div>
        <h1 className="description2">Similar Jobs</h1>
        {similarJobsDefined &&
          similarJobsData.map(each => (
            <SimilarJobs similarJobDetails={each} key={each.id} />
          ))}
      </div>
    )
  }

  renderJoBItemDetailsFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button type="button" onClick={this.getJobItemDetails()}>
        Retry
      </button>
    </div>
  )

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobItemDetailsView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJoBItemDetailsSuccessView()
      case apiStatusConstants.failure:
        return this.renderJoBItemDetailsFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="job-item-details-route-container">
        <Header />
        <div className="job-item-details-route">
          {this.renderJobItemDetailsView()}
        </div>
      </div>
    )
  }
}

export default JobItemDetails
