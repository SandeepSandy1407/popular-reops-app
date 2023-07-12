import {Component} from 'react'
import Loader from 'react-loader-spinner'

import LanguageFilterItem from '../LanguageFilterItem'
import RepositoryItem from '../RepositoryItem'

const languageFiltersData = [
  {id: 'ALL', language: 'All'},
  {id: 'JAVASCRIPT', language: 'Javascript'},
  {id: 'RUBY', language: 'Ruby'},
  {id: 'JAVA', language: 'Java'},
  {id: 'CSS', language: 'CSS'},
]
const apiRequestStatus = {
  loading: 'LOADING',
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

// Write your code here
class GithubPopularRepos extends Component {
  state = {
    repoStatus: apiRequestStatus.initial,
    selectedTab: languageFiltersData[0].id,
    listOfItems: [],
  }

  componentDidMount() {
    this.startFetching()
  }

  startFetching = async () => {
    this.setState({repoStatus: apiRequestStatus.loading})
    const url = 'https://apis.ccbp.in/popular-repos?language=ALL'
    const response = await fetch(url)
    console.log(response.ok)
    console.log(response)
    if (response.ok) {
      const fetchedData = await response.json()
      const convertedData = fetchedData.popular_repos.map(eachItem => ({
        name: eachItem.name,
        id: eachItem.id,
        issuesCount: eachItem.issues_count,
        forksCount: eachItem.forks_count,
        starsCount: eachItem.stars_count,
        avatarUrl: eachItem.avatar_url,
      }))
      this.setState({
        listOfItems: convertedData,
        repoStatus: apiRequestStatus.success,
      })
    } else if (response.status === 401) {
      this.setState({repoStatus: apiRequestStatus.failure})
    }
  }

  changeLanguage = selectedId => {
    console.log(selectedId)
    this.setState(
      {
        selectedTab: selectedId,
      },
      this.languagePreferredSearch,
    )
  }

  languagePreferredSearch = async () => {
    this.setState({repoStatus: apiRequestStatus.loading})
    const {selectedTab} = this.state
    const url = `https://apis.ccbp.in/popular-repos?language=${selectedTab}`
    const anotherResponse = await fetch(url)
    if (anotherResponse.ok) {
      console.log(anotherResponse)
      const temList = await anotherResponse.json()
      const convertedData = temList.popular_repos.map(eachItem => ({
        name: eachItem.name,
        id: eachItem.id,
        issuesCount: eachItem.issues_count,
        forksCount: eachItem.forks_count,
        starsCount: eachItem.stars_count,
        avatarUrl: eachItem.avatar_url,
      }))
      this.setState({
        listOfItems: convertedData,
        repoStatus: apiRequestStatus.success,
      })
    } else if (anotherResponse.status === 401) {
      this.setState({repoStatus: apiRequestStatus.failure})
    }
  }

  renderLoader = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0284c7" height={80} width={80} />
    </div>
  )

  renderFailure = () => (
    <div>
      <h1>Popular</h1>
      {languageFiltersData.map(eachItem => (
        <LanguageFilterItem
          inputListItem={eachItem}
          changeLanguage={this.changeLanguage}
          key={eachItem.id}
        />
      ))}
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
          alt="failure view"
        />
      </div>
    </div>
  )

  renderSuccess = () => {
    const {listOfItems} = this.state
    console.log(languageFiltersData)
    return (
      <div>
        <h1>Popular</h1>
        {languageFiltersData.map(eachItem => (
          <LanguageFilterItem
            inputListItem={eachItem}
            changeLanguage={this.changeLanguage}
            key={eachItem.id}
          />
        ))}
        <ul>
          {listOfItems.map(eachItem => (
            <RepositoryItem inputListItem={eachItem} key={eachItem.id} />
          ))}
        </ul>
      </div>
    )
  }

  render() {
    const {repoStatus} = this.state

    switch (repoStatus) {
      case apiRequestStatus.failure:
        return this.renderFailure()

      case apiRequestStatus.success:
        return this.renderSuccess()

      case apiRequestStatus.loading:
        return this.renderLoader()

      default:
        return null
    }
  }
}
export default GithubPopularRepos
