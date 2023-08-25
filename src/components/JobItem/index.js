import {Link} from 'react-router-dom'

import {BsFillBriefcaseFill} from 'react-icons/bs'

import {MdLocationOn} from 'react-icons/md'

import {AiFillStar} from 'react-icons/ai'

import './index.css'

const JobItem = props => {
  const {JobDetails} = props
  const {
    companyLogoUrl,
    title,
    jobDescription,
    rating,
    location,
    employmentType,
    id,
  } = JobDetails
  return (
    <Link to={`/jobs/${id}`} className="job-item-route">
      <li>
        <div className="company-logo-container">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />

          <div className="company-details">
            <h1 className="title">{title}</h1>
            <div className="rating-container">
              <AiFillStar color="#fbbf24" className="width" />
              <p className="rating">{rating}</p>
            </div>
          </div>
        </div>
        <div className="job-location-details">
          <MdLocationOn className="width" />
          <p className="location">{location}</p>

          <BsFillBriefcaseFill className="width" />
          <p className="employment-type">{employmentType}</p>
        </div>
        <hr />
        <h1 className="description-text">Description</h1>
        <p className="description">{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobItem
