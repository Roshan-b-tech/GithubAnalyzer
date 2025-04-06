import { useState } from 'react';
import { GithubIcon, SearchIcon, StarIcon, CodeIcon, Moon, Sun } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { useTheme } from "@/components/theme-provider";

interface ContributionDay {
  contributionCount: number;
  date: string;
}

interface Repository {
  id: number;
  name: string;
  description: string;
  stargazers_count: number;
  language: string;
  html_url: string;
}

function App() {
  const [username, setUsername] = useState('');
  const [repos, setRepos] = useState<Repository[]>([]);
  const [contributionData, setContributionData] = useState<ContributionDay[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  const fetchGitHubData = async () => {
    if (!username) {
      toast({
        title: "Error",
        description: "Please enter a GitHub username",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Fetch repositories
      const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated`);
      if (!reposResponse.ok) throw new Error('Failed to fetch repositories');
      const reposData = await reposResponse.json();
      setRepos(reposData);

      // Fetch contribution data using GitHub's GraphQL API
      const query = `
        query($username: String!) {
          user(login: $username) {
            contributionsCollection {
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    contributionCount
                    date
                  }
                }
              }
            }
          }
        }
      `;

      const token = import.meta.env.VITE_GITHUB_TOKEN;
      
      if (!token) {
        throw new Error('GitHub token not found. Please add VITE_GITHUB_TOKEN to your .env file');
      }

      const contributionResponse = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          'Authorization': `bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: { username },
        }),
      });

      if (!contributionResponse.ok) {
        throw new Error('Failed to fetch contribution data');
      }
      
      const contributionResult = await contributionResponse.json();
      
      if (contributionResult.errors) {
        throw new Error(contributionResult.errors[0]?.message || 'Failed to fetch contribution data');
      }

      const contributions = contributionResult.data?.user?.contributionsCollection?.contributionCalendar?.weeks
        ?.flatMap((week: any) => week.contributionDays)
        ?.filter(Boolean) || [];

      setContributionData(contributions);

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch GitHub data. Please check the username and try again.",
        variant: "destructive",
      });
      setContributionData([]);
      setRepos([]);
    } finally {
      setLoading(false);
    }
  };

  const getCommitIntensity = (count: number) => {
    if (count === 0) return 'bg-[#161b22] border border-[#2d333b] hover:bg-[#1c2129] transition-all duration-300 hover:scale-150 hover:z-10';
    if (count <= 3) return 'bg-[#0e4429] border border-[#1b4b2d] hover:bg-[#155d38] transition-all duration-300 hover:scale-150 hover:z-10';
    if (count <= 6) return 'bg-[#006d32] border border-[#26a641] hover:bg-[#008d41] transition-all duration-300 hover:scale-150 hover:z-10';
    if (count <= 9) return 'bg-[#26a641] border border-[#39d353] hover:bg-[#2fc04c] transition-all duration-300 hover:scale-150 hover:z-10';
    return 'bg-[#39d353] border border-[#4ae168] hover:bg-[#4ae168] transition-all duration-300 hover:scale-150 hover:z-10';
  };

  const getContributionMatrix = () => {
    const matrix: ContributionDay[][] = Array(52).fill(null).map(() => Array(7).fill(null));
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    contributionData.forEach((day) => {
      const date = new Date(day.date);
      if (date >= oneYearAgo && date <= today) {
        const weekIndex = Math.floor((today.getTime() - date.getTime()) / (7 * 24 * 60 * 60 * 1000));
        const dayIndex = date.getDay();
        if (weekIndex < 52) {
          matrix[51 - weekIndex][dayIndex] = day;
        }
      }
    });

    return matrix;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const contributionMatrix = getContributionMatrix();

  return (
    <div className={`min-h-screen p-8 ${theme === 'dark' ? 'bg-[#0d1117]' : 'bg-gradient-to-r from-white to-emerald-100'}`}>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`rounded-full ${theme === 'dark' ? 'text-white hover:text-white hover:bg-gray-800' : 'text-gray-800 hover:bg-gray-100'}`}
          >
            {theme === 'dark' ? (
              <Sun className="h-[1.5rem] w-[1.5rem]" />
            ) : (
              <Moon className="h-[1.5rem] w-[1.5rem]" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center space-y-6"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className={`absolute inset-0 bg-gradient-to-r ${theme === 'dark' ? 'from-blue-500/20 to-purple-500/20' : 'from-primary/20 to-secondary/20'} rounded-full blur-2xl`}
            />
            <GithubIcon className={`w-20 h-20 relative z-10 ${theme === 'dark' ? 'text-white' : ''}`} />
          </div>
          <h1 className={`text-5xl font-bold ${theme === 'dark' ? 'text-white' : 'text-emerald-600'}`}>
            GitHub Profile Analyzer
          </h1>
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'} text-lg text-center max-w-md`}>
            Discover GitHub profiles and analyze contribution patterns
          </p>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="text"
              placeholder="Enter GitHub username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchGitHubData()}
              className={`h-12 text-lg ${theme === 'dark' ? 'bg-[#161b22] border-[#30363d] text-white placeholder:text-gray-500' : ''}`}
            />
            <Button 
              onClick={fetchGitHubData} 
              disabled={loading}
              className={`h-12 px-6 ${theme === 'dark' ? 'bg-[#238636] hover:bg-[#2ea043] text-white' : ''}`}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className={`w-4 h-4 border-2 border-t-transparent rounded-full animate-spin ${theme === 'dark' ? 'border-white' : 'border-background'}`} />
                  <span>Loading...</span>
                </div>
              ) : (
                <>
                  <SearchIcon className="mr-2 h-5 w-5" />
                  Search
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {contributionMatrix.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className={`border-none shadow-lg ${theme === 'dark' ? 'bg-white' : 'bg-[#0d1117]'} ${theme === 'dark' ? 'text-gray-900' : 'text-white'}`}>
              <CardHeader>
                <CardTitle className={`text-2xl ${theme === 'dark' ? 'text-gray-900' : 'text-white'}`}>Contribution Activity</CardTitle>
                <CardDescription className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>Commit frequency over the past year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="overflow-x-auto -mx-4 px-4">
                    <div className="min-w-[750px]">
                      <div className="flex gap-4">
                        <div className={`flex flex-col justify-between text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} py-2 h-full`}>
                          {['Mon', '', 'Wed', '', 'Fri', ''].map((day) => (
                            <span key={day} className="h-3 leading-3">{day}</span>
                          ))}
                        </div>
                        <div className="flex-1">
                          <div className={`flex justify-between text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} mb-2`}>
                            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => (
                              <span key={index}>{month}</span>
                            ))}
                          </div>
                          <div className="inline-flex gap-[3px]">
                            {contributionMatrix.map((week, weekIndex) => (
                              <div key={weekIndex} className="flex flex-col gap-[3px]">
                                {week.map((day, dayIndex) => (
                                  <TooltipProvider key={`${weekIndex}-${dayIndex}`}>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <motion.div
                                          initial={{ scale: 0.8 }}
                                          animate={{ scale: 1 }}
                                          transition={{ duration: 0.2 }}
                                          className={`w-[10px] h-[10px] rounded-[2px] ${getCommitIntensity(day?.contributionCount || 0)}`}
                                        />
                                      </TooltipTrigger>
                                      <TooltipContent className={`${theme === 'dark' ? 'bg-gray-900 border-gray-700 text-white' : 'bg-[#161b22] border-[#2d333b] text-white'}`}>
                                        <p className="font-medium">
                                          {day?.contributionCount || 0} contributions
                                        </p>
                                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`}>
                                          {day ? formatDate(day.date) : 'No contributions'}
                                        </p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                ))}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={`flex items-center justify-end gap-2 text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                    <span>Less</span>
                    <div className="flex gap-[2px]">
                      <div className="w-[10px] h-[10px] rounded-[2px] bg-[#161b22] border border-[#2d333b]" />
                      <div className="w-[10px] h-[10px] rounded-[2px] bg-[#0e4429] border border-[#1b4b2d]" />
                      <div className="w-[10px] h-[10px] rounded-[2px] bg-[#006d32] border border-[#26a641]" />
                      <div className="w-[10px] h-[10px] rounded-[2px] bg-[#26a641] border border-[#39d353]" />
                      <div className="w-[10px] h-[10px] rounded-[2px] bg-[#39d353] border border-[#4ae168]" />
                    </div>
                    <span>More</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {repos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {repos.map((repo, index) => (
              <motion.div
                key={repo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className={`flex flex-col h-full transition-all duration-300 border-none transform hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/10 ${theme === 'dark' ? 'bg-white text-gray-900' : 'bg-[#0d1117] text-white'}`}>
                  <CardHeader>
                    <CardTitle className="text-xl">
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`hover:text-[#2f81f7] transition-colors duration-200 ${theme === 'dark' ? 'text-gray-900' : 'text-white'}`}
                      >
                        {repo.name}
                      </a>
                    </CardTitle>
                    <CardDescription className={`line-clamp-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                      {repo.description || 'No description available'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className={`mt-auto pt-6 border-t ${theme === 'dark' ? 'border-gray-200' : 'border-[#21262d]'}`}>
                    <div className="flex justify-between text-sm">
                      <span className={`flex items-center gap-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                        <CodeIcon className="w-4 h-4" />
                        {repo.language || 'No language'}
                      </span>
                      <span className={`flex items-center gap-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                        <StarIcon className="w-4 h-4" />
                        {repo.stargazers_count}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default App;