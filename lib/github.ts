import axios from 'axios';

interface GithubRepo {
  name: string;
  description: string;
  html_url: string;
  homepage: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  topics: string[];
  created_at: string;
  updated_at: string;
}

interface GithubUser {
  login: string;
  name: string;
  bio: string;
  company: string;
  blog: string;
  location: string;
  email: string;
  hireable: boolean;
  twitter_username: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  avatar_url: string;
}

export async function fetchGithubProfile(username: string) {
  try {
    // Use GitHub's public API (with rate limiting)
    const userResponse = await axios.get(`https://api.github.com/users/${username}`);
    const user: GithubUser = userResponse.data;
    
    // Get repositories (limited to first 100)
    const reposResponse = await axios.get(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
    const repos: GithubRepo[] = reposResponse.data;
    
    // Get languages used across repos
    const languages = new Set<string>();
    repos.forEach(repo => {
      if (repo.language) languages.add(repo.language);
      if (repo.topics && repo.topics.length > 0) {
        repo.topics.forEach(topic => languages.add(topic));
      }
    });
    
    // Process top repositories (starred, forked, or recently updated)
    const topRepos = repos
      .filter(repo => !repo.fork) // Exclude forked repos
      .sort((a, b) => {
        const aScore = a.stargazers_count * 3 + a.forks_count * 2;
        const bScore = b.stargazers_count * 3 + b.forks_count * 2;
        return bScore - aScore;
      })
      .slice(0, 6); // Get top 6 repos
    
    return {
      profileData: {
        name: user.name || user.login,
        title: user.bio ? user.bio.split('\n')[0] : 'Software Developer',
        about: user.bio || `Software developer with ${repos.length} public repositories on GitHub.`,
        company: user.company,
        blog: user.blog,
        location: user.location,
        socialMedia: {
          github: `https://github.com/${username}`,
          twitter: user.twitter_username ? `https://twitter.com/${user.twitter_username}` : null,
        },
        avatarUrl: user.avatar_url,
        githubStats: {
          repos: user.public_repos,
          followers: user.followers,
          following: user.following,
          joined: new Date(user.created_at).getFullYear()
        }
      },
      repositories: topRepos.map(repo => ({
        name: repo.name,
        description: repo.description,
        url: repo.html_url,
        homepage: repo.homepage,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language,
        topics: repo.topics,
        created: repo.created_at,
        updated: repo.updated_at
      })),
      languages: Array.from(languages),
      source: 'github'
    };
  } catch (error) {
    console.error('Error fetching GitHub profile:', error);
    throw new Error('Failed to retrieve GitHub profile data');
  }
}

// Validate GitHub username format
export function isValidGithubUsername(username: string): boolean {
  // GitHub usernames allow alphanumeric characters and hyphens
  // Cannot have consecutive hyphens, cannot begin or end with a hyphen
  // Length between 1-39 characters
  const githubUsernameRegex = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
  return githubUsernameRegex.test(username);
}