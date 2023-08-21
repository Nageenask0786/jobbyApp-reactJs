import {Link} from 'react-router-dom'
import './index.css'
import Header from '../Header'

const Home = () => (
  <div className="home-route-container">
    <Header />
    <div className="home-route">
      <h1 className="heading">Find The Job That Fits Your Life</h1>
      <p className="job-description">
        Millions of people are searching for jobs, salary information,company
        reviews. <br />
        Find the job that fits your abilities and potential
      </p>
      <Link to="/jobs">
        <button type="button" className="find-jobs-button">
          Find Jobs
        </button>
      </Link>
    </div>
  </div>
)

export default Home
