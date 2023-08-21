import './index.css'

const SkillItem = props => {
  const {skillsDetails} = props
  const {imageUrl, name} = skillsDetails
  return (
    <li className="skill-items">
      <img src={imageUrl} alt={name} className="skills-image" />
      <p className="name">{name}</p>
    </li>
  )
}

export default SkillItem
