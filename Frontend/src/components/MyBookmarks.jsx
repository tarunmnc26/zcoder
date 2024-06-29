import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { baseUrl } from '../url';






const MyBookmarks = () => {
 
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState('');
  useEffect(() => {
    if (localStorage.getItem('success')) {
      const user = JSON.parse(localStorage.getItem('user'));
      setUser(user.email);
    }
  }, []);
  useEffect(() => {
    const fetchBookmarkedQuestions = async () => {
      if (!user) return; // If user is not set, return early
      try {
        const response = await fetch(`${baseUrl}/bookmarkquestions?email=${user}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch bookmarked questions');
        }

        const data = await response.json();
       console.log(data);
        setQuestions(data.bookmarkedQuestions);
        console.log(data.bookmarkedQuestions);

      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarkedQuestions();
  }, [user]);



  const deleteBookmark = async (question) => {
    try {
      const response = await fetch(`${baseUrl}/unbookmark/${question}/${user}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete bookmark');
      }

      setQuestions((prevQuestions) => prevQuestions.filter((q) => q._id !== question));
     toast.success('Bookmark deleted successfully');
      const data = await response.json();
      console.log(data);
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-md">
  
    <h2 className="text-2xl font-bold mb-4 text-white">  Bookmarked Questions</h2>
   
  

<div id="questions-container" className="space-y-4">
  {questions.map((question) => (
    <div className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition duration-300 ease-in-out">

      <div className="flex space-x-4  ">
      <h3 className="text-xl font-semibold text-blue-400 mb-2">{question.title} </h3>
      <button type="button"onClick={()=>{deleteBookmark(question._id)}}  className="focus:outline-none  text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Delete</button>
        
      </div>
      
     
    
      <a href={question.link} target='_blank' className="text-blue-300 underline hover:text-blue-500 mb-2 block">Link to the Problem</a>
      <p className="text-gray-400 mb-2"><strong>Topics:</strong> {question.topics.join(", ")}</p>
      <p className="text-gray-400"><strong>Solution:</strong>  <SyntaxHighlighter language="cpp"  showLineNumbers>
    {question.solution}
  </SyntaxHighlighter></p>
    </div>
  ))}
</div>
</div>
  )
}

export default MyBookmarks
