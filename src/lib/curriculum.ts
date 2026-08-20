export interface Task {
  id: string;
  title: string;
  scope: string;
  criteria: string;
}

export interface TrackInfo {
  id: 'PYTHON' | 'UI_UX' | 'CPP' | 'WEB_DEV' | 'REACT' | 'NEXT_JS' | 'MERN';
  title: string;
  desc: string;
  tasks: Task[];
}

export const tracks: Record<string, TrackInfo> = {
  PYTHON: {
    id: 'PYTHON',
    title: 'Python Development Basics',
    desc: 'Focuses on core programming concepts, data structures, and basic algorithms suitable for beginners.',
    tasks: [
      {
        id: 'PY-01',
        title: 'Variables & Data Types',
        scope: 'Create a simple script to store and print user information.',
        criteria: 'Use strings, integers, and booleans. Print a formatted greeting message.'
      },
      {
        id: 'PY-02',
        title: 'Basic Calculator',
        scope: 'Write a Python script that takes two numbers and an operator.',
        criteria: 'Implement functions for add, subtract, multiply, and divide. Handle division by zero.'
      },
      {
        id: 'PY-03',
        title: 'Loops and Lists',
        scope: 'Create a simple To-Do list using a Python List.',
        criteria: 'Use a while loop to let the user add, remove, and view items in the list.'
      },
      {
        id: 'PY-04',
        title: 'File I/O Basics',
        scope: 'Read and write text to a file.',
        criteria: 'Ask the user for input, save it to a .txt file, and then read the file back to the console.'
      },
      {
        id: 'PY-05',
        title: 'Object Oriented Programming Intro',
        scope: 'Create a simple "Student" class.',
        criteria: 'Class should have attributes like name, roll_number, and a method to display details.'
      }
    ]
  },
  UI_UX: {
    id: 'UI_UX',
    title: 'Basic UI/UX Design',
    desc: 'Introduction to design tools, wireframing, and basic prototyping.',
    tasks: [
      {
        id: 'UI-01',
        title: 'Figma Setup & Shapes',
        scope: 'Create an account and draw basic geometric shapes.',
        criteria: 'Use rectangles, circles, and lines. Apply different colors and borders.'
      },
      {
        id: 'UI-02',
        title: 'Wireframing a Login Page',
        scope: 'Design a low-fidelity wireframe for a mobile login screen.',
        criteria: 'Include placeholders for email, password, and a login button.'
      },
      {
        id: 'UI-03',
        title: 'Color Palette & Typography',
        scope: 'Select a primary color, secondary color, and a font pair.',
        criteria: 'Create a small style guide frame showing heading sizes and color swatches.'
      },
      {
        id: 'UI-04',
        title: 'High-Fidelity App Screen',
        scope: 'Convert the login wireframe into a colored, polished screen.',
        criteria: 'Use real icons, proper alignment, and consistent padding.'
      },
      {
        id: 'UI-05',
        title: 'Basic Prototyping',
        scope: 'Link two screens together.',
        criteria: 'Create a "Home" screen and link the login button to navigate to it.'
      }
    ]
  },
  CPP: {
    id: 'CPP',
    title: 'C++ Programming Basics',
    desc: 'Introduction to syntax, control structures, and basic memory management.',
    tasks: [
      {
        id: 'CP-01',
        title: 'Hello World & Variables',
        scope: 'Write a program to print a greeting and use basic data types.',
        criteria: 'Use int, float, and string. Output variables using cout.'
      },
      {
        id: 'CP-02',
        title: 'Control Structures',
        scope: 'Build a number guessing game.',
        criteria: 'Use if/else statements and a while loop to let the user guess a pre-defined number.'
      },
      {
        id: 'CP-03',
        title: 'Functions & Arrays',
        scope: 'Create a program to find the maximum number in an array.',
        criteria: 'Pass an array to a function and return the highest integer.'
      },
      {
        id: 'CP-04',
        title: 'Pointers Basics',
        scope: 'Demonstrate passing by reference using pointers.',
        criteria: 'Write a swap() function that exchanges the values of two variables using pointers.'
      },
      {
        id: 'CP-05',
        title: 'Basic Classes (OOP)',
        scope: 'Define a "Rectangle" class.',
        criteria: 'Include width and height attributes, and a method to calculate the area.'
      }
    ]
  },
  WEB_DEV: {
    id: 'WEB_DEV',
    title: 'Web Development Basics (HTML/CSS)',
    desc: 'Introduction to building static web pages with HTML and CSS.',
    tasks: [
      {
        id: 'WD-01',
        title: 'Basic HTML Structure',
        scope: 'Create a simple webpage with headings, paragraphs, and lists.',
        criteria: 'Include a title, an h1 tag, a p tag, and an unordered list.'
      },
      {
        id: 'WD-02',
        title: 'Adding Media and Links',
        scope: 'Enhance the webpage with images and hyper-links.',
        criteria: 'Embed an image using the <img> tag and link to another website.'
      },
      {
        id: 'WD-03',
        title: 'CSS Styling Basics',
        scope: 'Style the webpage using an external CSS file.',
        criteria: 'Change the background color, font family, and text colors.'
      },
      {
        id: 'WD-04',
        title: 'CSS Flexbox Layout',
        scope: 'Create a simple navigation bar using Flexbox.',
        criteria: 'Use display: flex to align navigation links horizontally.'
      },
      {
        id: 'WD-05',
        title: 'Basic JavaScript Interaction',
        scope: 'Add a button that changes the text on the page when clicked.',
        criteria: 'Use document.getElementById() and an onClick event listener.'
      }
    ]
  },
  REACT: {
    id: 'REACT',
    title: 'React.js Basics',
    desc: 'Introduction to components, props, and state in React.',
    tasks: [
      {
        id: 'RE-01',
        title: 'Hello React Component',
        scope: 'Create a functional component that renders a greeting.',
        criteria: 'Export the component and render it in the main App file.'
      },
      {
        id: 'RE-02',
        title: 'Using Props',
        scope: 'Create a reusable "UserCard" component.',
        criteria: 'Pass name and age as props and display them inside the card.'
      },
      {
        id: 'RE-03',
        title: 'State with useState',
        scope: 'Build a simple counter application.',
        criteria: 'Include increment and decrement buttons that update a number on the screen.'
      },
      {
        id: 'RE-04',
        title: 'Handling Forms',
        scope: 'Create a simple contact form.',
        criteria: 'Capture input values using state and display an alert on submit.'
      },
      {
        id: 'RE-05',
        title: 'Rendering Lists',
        scope: 'Display a list of items from an array.',
        criteria: 'Use the .map() function to render an array of strings into an unordered list.'
      }
    ]
  },
  NEXT_JS: {
    id: 'NEXT_JS',
    title: 'Next.js Fundamentals',
    desc: 'Introduction to routing, pages, and basic Next.js features.',
    tasks: [
      {
        id: 'NX-01',
        title: 'App Router Basics',
        scope: 'Create a Home page and an About page.',
        criteria: 'Use the new App Router structure (page.tsx) and navigate between them.'
      },
      {
        id: 'NX-02',
        title: 'Next/Link Navigation',
        scope: 'Create a navigation bar.',
        criteria: 'Use the <Link> component to navigate without full page reloads.'
      },
      {
        id: 'NX-03',
        title: 'Next/Image Component',
        scope: 'Display an optimized image.',
        criteria: 'Import a local image and render it using the <Image> component with proper width and height.'
      },
      {
        id: 'NX-04',
        title: 'Basic Server Component',
        scope: 'Create a component that runs only on the server.',
        criteria: 'Do not use "use client". Render some static text.'
      },
      {
        id: 'NX-05',
        title: 'Client Component Interactivity',
        scope: 'Add a client-side interactive button.',
        criteria: 'Use "use client" and add a button that toggles a boolean state.'
      }
    ]
  },
  MERN: {
    id: 'MERN',
    title: 'MERN Stack Introduction',
    desc: 'Basic overview of connecting a React frontend to an Express backend.',
    tasks: [
      {
        id: 'ME-01',
        title: 'Basic Express Server',
        scope: 'Setup a Node.js project with Express.',
        criteria: 'Create a GET route at "/" that returns "Hello World".'
      },
      {
        id: 'ME-02',
        title: 'JSON API Endpoint',
        scope: 'Create an endpoint returning an array of objects.',
        criteria: 'Return dummy user data as JSON from a /users route.'
      },
      {
        id: 'ME-03',
        title: 'Connecting to MongoDB',
        scope: 'Use Mongoose to connect to a local or cloud database.',
        criteria: 'Successfully log "Database connected" on server startup.'
      },
      {
        id: 'ME-04',
        title: 'Creating a Mongoose Model',
        scope: 'Define a simple "Note" schema.',
        criteria: 'Include fields for title and content (both strings).'
      },
      {
        id: 'ME-05',
        title: 'React Fetch',
        scope: 'Fetch the JSON API data from a React frontend.',
        criteria: 'Use the fetch API or Axios in a useEffect hook and display the data.'
      }
    ]
  }
};

export const getTrackTitle = (trackKey: string): string => {
  return tracks[trackKey]?.title || trackKey;
};
export const getTrackDesc = (trackKey: string): string => {
  return tracks[trackKey]?.desc || '';
};
export const getTrackTasks = (trackKey: string): Task[] => {
  return tracks[trackKey]?.tasks || [];
};
