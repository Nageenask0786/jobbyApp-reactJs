import {AiFillStar} from 'react-icons/ai'

import {MdLocationOn} from 'react-icons/md'

import {BsFillBriefcaseFill} from 'react-icons/bs'

const SimilarJobs = props => {
  const {similarJobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
  } = similarJobDetails
  return (
    <li className="job-item-details">
      <div className="company-logo-container2">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
          className="company-logo2"
        />

        <div className="company-details2">
          <h1 className="title2">{title}</h1>
          <div className="rating-container2">
            <AiFillStar color="#fbbf24" />
            <p className="rating2">{rating}</p>
          </div>
          <h1 className="description-text2">Description</h1>
          <p className="description2">{jobDescription}</p>
          <div className="job-location-details">
            <MdLocationOn className="width2" />
            <p className="location2">{location}</p>

            <BsFillBriefcaseFill className="width2" />
            <p className="employment-type2">{employmentType}</p>
          </div>
        </div>
      </div>
    </li>
  )
}

export default SimilarJobs
