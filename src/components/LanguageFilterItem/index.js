// Write your code here

const LanguageFilterItem = props => {
  const {inputListItem, changeLanguage} = props
  const {id, language} = inputListItem
  const anotherLanguage = () => {
    changeLanguage(id)
  }
  return (
    <li>
      <button type="button" onClick={anotherLanguage}>
        {language}
      </button>
    </li>
  )
}
export default LanguageFilterItem
