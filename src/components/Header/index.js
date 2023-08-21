import {Link, withRouter} from 'react-router-dom'

import {AiFillHome} from 'react-icons/ai'

import {FiLogOut} from 'react-icons/fi'

import {BsFillBriefcaseFill} from 'react-icons/bs'

import Cookies from 'js-cookie'

import './index.css'

const Header = props => {
  const onClickLogOut = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="header-container">
      <div className="mobile-header">
        <Link to="/">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
        </Link>
        <li>
          <Link to="/">
            <AiFillHome color="#ffffff" width="20%" />
          </Link>
        </li>
        <li>
          <Link to="/jobs">
            <BsFillBriefcaseFill color="#ffffff" />
          </Link>
        </li>
        <li>
          <button type="button" onClick={onClickLogOut}>
            <FiLogOut color="#ffffff" />
          </button>
        </li>
      </div>
      <div className="nav-large-container">
        <div>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
        </div>

        <ul className="nav-items-container">
          <li>
            <Link to="/" className="nav-items">
              Home
            </Link>
          </li>
          <li>
            <Link to="/jobs" className="nav-items">
              Jobs
            </Link>
          </li>
          <li>
            <button
              type="button"
              className="log-out-btn"
              onClick={onClickLogOut}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default withRouter(Header)
