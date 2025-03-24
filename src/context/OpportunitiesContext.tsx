"use client";
import { createContext, useContext, useState, ReactNode } from "react";

export interface Opportunity {
  title: string;
  organizer: string;
  shortDescription: string;
  description: string;
  image: string;
  views: string;
  endDate: string;
}

interface OpportunitiesContextType {
  opportunities: Opportunity[];
  addOpportunity: (opp: Opportunity) => void;
  deleteOpportunity: (title: string) => void;
  updateOpportunity: (title: string, opp: Opportunity) => void;
}

const OpportunitiesContext = createContext<OpportunitiesContextType | undefined>(undefined);

export const OpportunitiesProvider = ({ children }: { children: ReactNode }) => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([
    {
        image: 'https://cdn.pixabay.com/photo/2016/02/28/12/55/boy-1226964_1280.jpg',
        title: 'Tech Innovators Summit',
        organizer: 'Global Tech Council',
        shortDescription: 'A summit for tech innovators.',
        description: 'Join the Global Tech Council for an exciting summit on the latest in technology and innovation.',
        views: '1.5k',
        endDate: '2023-11-15',
    },
    {
        image: 'https://cdn.pixabay.com/photo/2022/06/13/19/43/man-7260571_1280.jpg',
        title: 'Art & Design Expo',
        organizer: 'Creative Minds Collective',
        shortDescription: 'An expo showcasing art and design.',
        description: 'Explore the world of art and design with the Creative Minds Collective.',
        views: '2.3k',
        endDate: '2023-12-01',
    },
    {
        image: 'https://cdn.pixabay.com/photo/2025/03/19/13/52/ai-generated-9480767_1280.jpg',
        title: 'Future of AI Conference',
        organizer: 'AI Research Institute',
        shortDescription: 'A conference on the future of AI.',
        description: 'Discover the latest advancements in AI at the Future of AI Conference.',
        views: '3.7k',
        endDate: '2023-10-25',
    },
    {
        image: 'https://cdn.pixabay.com/photo/2018/09/07/14/11/city-3660779_1280.jpg',
        title: 'Green Energy Symposium',
        organizer: 'Eco Solutions Network',
        shortDescription: 'A symposium on green energy solutions.',
        description: 'Learn about sustainable energy solutions at the Green Energy Symposium.',
        views: '1.8k',
        endDate: '2023-11-30',
    },
    {
        image: 'https://cdn.pixabay.com/photo/2017/08/30/09/10/forward-2696401_1280.jpg',
        title: 'Music Festival 2023',
        organizer: 'Harmony Productions',
        shortDescription: 'A festival celebrating music.',
        description: 'Enjoy live performances from top artists at the Music Festival 2023.',
        views: '4.2k',
        endDate: '2023-12-10',
    },
    {
        image: 'https://cdn.pixabay.com/photo/2014/07/18/08/38/opportunity-396265_1280.jpg',
        title: 'Startup Pitch Night',
        organizer: 'Venture Capital Hub',
        shortDescription: 'A night for startups to pitch their ideas.',
        description: 'Witness innovative startup pitches at the Startup Pitch Night.',
        views: '2.1k',
        endDate: '2023-11-20',
    },
    {
        image: 'https://cdn.pixabay.com/photo/2020/06/12/20/33/new-year-5291766_1280.jpg',
        title: 'Health & Wellness Fair',
        organizer: 'Wellness Alliance',
        shortDescription: 'A fair promoting health and wellness.',
        description: 'Explore health and wellness products and services at the Health & Wellness Fair.',
        views: '1.9k',
        endDate: '2023-12-05',
    },
    {
        image: 'https://cdn.pixabay.com/photo/2022/06/24/17/35/relaxation-7282116_1280.jpg',
        title: 'Space Exploration Forum',
        organizer: 'Galactic Research Society',
        shortDescription: 'A forum on space exploration.',
        description: 'Dive into the latest discoveries in space exploration at the Space Exploration Forum.',
        views: '3.4k',
        endDate: '2023-11-25',
    },
    {
        image: 'https://cdn.pixabay.com/photo/2023/12/31/10/08/woman-8479822_1280.jpg',
        title: 'Fashion Week 2023',
        organizer: 'Style Innovators Group',
        shortDescription: 'A showcase of the latest fashion trends.',
        description: 'Experience the latest in fashion at Fashion Week 2023.',
        views: '5.0k',
        endDate: '2023-12-15',
    },
    {
        image: 'https://cdn.pixabay.com/photo/2022/11/03/17/55/hall-7568043_1280.jpg',
        title: 'Blockchain Revolution',
        organizer: 'Crypto Innovators',
        shortDescription: 'A conference on blockchain technology.',
        description: 'Learn about the future of blockchain at the Blockchain Revolution conference.',
        views: '2.8k',
        endDate: '2023-11-10',
    },
    {
        image: 'https://cdn.pixabay.com/photo/2021/12/26/08/32/lantern-6894507_1280.jpg',
        title: 'Film & Media Festival',
        organizer: 'Cinema Arts Society',
        shortDescription: 'A festival celebrating film and media.',
        description: 'Enjoy screenings and discussions at the Film & Media Festival.',
        views: '3.1k',
        endDate: '2023-12-20',
    },
      {
          image: 'https://cdn.pixabay.com/photo/2022/11/03/17/55/hall-7568043_1280.jpg',
          title: 'Blockchain Revolution',
          organizer: 'Crypto Innovators',
          shortDescription: 'A conference on blockchain technology.',
          description: 'Learn about the future of blockchain at the Blockchain Revolution conference.',
          views: '2.8k',
          endDate: '2023-11-10',
      },
      {
          image: 'https://cdn.pixabay.com/photo/2023/10/21/00/36/ai-8330457_1280.jpg',
          title: 'AI in Healthcare Summit',
          organizer: 'HealthTech Innovators',
          shortDescription: 'Exploring AI applications in healthcare.',
          description: 'Discover how artificial intelligence is revolutionizing healthcare, from diagnostics to treatment.',
          views: '3.2k',
          endDate: '2023-11-18',
      },
      {
          image: 'https://cdn.pixabay.com/photo/2019/02/17/15/07/business-4002394_1280.jpg',
          title: 'Global Leadership Forum',
          organizer: 'World Leaders Network',
          shortDescription: 'A forum for global leaders.',
          description: 'Join world leaders to discuss global challenges and innovative solutions for a better future.',
          views: '4.5k',
          endDate: '2023-12-05',
      },
      {
          image: 'https://cdn.pixabay.com/photo/2018/01/18/07/31/bitcoin-3089728_1280.jpg',
          title: 'Crypto & Fintech Expo',
          organizer: 'Digital Finance Alliance',
          shortDescription: 'Exploring crypto and fintech innovations.',
          description: 'Learn about the latest trends in cryptocurrency and financial technology at this expo.',
          views: '3.7k',
          endDate: '2023-11-25',
      },
      {
          image: 'https://cdn.pixabay.com/photo/2024/04/08/20/00/brain-8684349_1280.jpg',
          title: 'Robotics & Automation Conference',
          organizer: 'Tech Innovators Association',
          shortDescription: 'A conference on robotics and automation.',
          description: 'Explore the future of robotics and automation in industries like manufacturing, healthcare, and more.',
          views: '2.9k',
          endDate: '2023-12-12',
      },
      {
          image: 'https://cdn.pixabay.com/photo/2016/11/22/19/15/audience-1850119_1280.jpg',
          title: 'Global Music Festival',
          organizer: 'Harmony Productions',
          shortDescription: 'A celebration of global music.',
          description: 'Experience live performances from artists around the world at the Global Music Festival.',
          views: '5.1k',
          endDate: '2023-12-20',
      },
      {
          image: 'https://cdn.pixabay.com/photo/2017/08/06/22/01/books-2596809_1280.jpg',
          title: 'Education Innovation Summit',
          organizer: 'Global Education Network',
          shortDescription: 'A summit on the future of education.',
          description: 'Discuss innovative approaches to education, from online learning to AI-powered classrooms.',
          views: '2.3k',
          endDate: '2023-11-30',
      },
      {
          image: 'https://cdn.pixabay.com/photo/2018/05/17/16/03/compass-3408928_1280.jpg',
          title: 'Sustainable Tourism Conference',
          organizer: 'Eco Travel Network',
          shortDescription: 'Promoting eco-friendly travel.',
          description: 'Learn about sustainable tourism practices and how to travel responsibly.',
          views: '1.8k',
          endDate: '2023-12-08',
      },
      {
          image: 'https://cdn.pixabay.com/photo/2024/05/23/12/24/ai-generated-8783105_1280.jpg',
          title: 'Cybersecurity & Privacy Forum',
          organizer: 'Cyber Defense Alliance',
          shortDescription: 'A forum on cybersecurity trends.',
          description: 'Explore the latest in cybersecurity and data privacy at this forum.',
          views: '3.4k',
          endDate: '2023-11-22',
      },
      {
          image: 'https://cdn.pixabay.com/photo/2016/11/29/12/54/cafe-1869656_1280.jpg',
          title: 'Startup Networking Night',
          organizer: 'Venture Capital Hub',
          shortDescription: 'A night for startups to connect.',
          description: 'Network with investors and fellow entrepreneurs at this startup networking event.',
          views: '2.1k',
          endDate: '2023-12-01',
      },
      {
          image: 'https://cdn.pixabay.com/photo/2016/03/26/22/21/books-1281581_1280.jpg',
          title: 'Literature & Arts Festival',
          organizer: 'Creative Minds Collective',
          shortDescription: 'Celebrating literature and arts.',
          description: 'Join authors, poets, and artists for a celebration of creativity and storytelling.',
          views: '2.7k',
          endDate: '2023-12-15',
      },
      {
          image: 'https://cdn.pixabay.com/photo/2018/05/08/08/44/artificial-intelligence-3382507_1280.jpg',
          title: 'AI & Machine Learning Expo',
          organizer: 'AI Research Institute',
          shortDescription: 'Exploring AI and machine learning.',
          description: 'Discover the latest advancements in AI and machine learning at this expo.',
          views: '3.8k',
          endDate: '2023-11-28',
      },
      {
          image: 'https://cdn.pixabay.com/photo/2017/09/05/10/20/business-2717066_1280.jpg',
          title: 'Global Business Summit',
          organizer: 'World Business Leaders',
          shortDescription: 'A summit for business leaders.',
          description: 'Gain insights from global business leaders and discuss the future of commerce.',
          views: '4.2k',
          endDate: '2023-12-10',
      },
      {
          image: 'https://cdn.pixabay.com/photo/2023/09/25/16/18/agriculture-8275498_1280.jpg',
          title: 'Sustainable Agriculture Forum',
          organizer: 'Green Earth Initiative',
          shortDescription: 'Promoting sustainable farming.',
          description: 'Learn about innovative solutions for sustainable agriculture and food security.',
          views: '1.9k',
          endDate: '2023-12-03',
      },
      {
          image: 'https://cdn.pixabay.com/photo/2017/01/14/10/56/people-1979261_1280.jpg',
          title: 'Women in Tech Conference',
          organizer: 'Tech Diversity Network',
          shortDescription: 'Empowering women in technology.',
          description: 'Celebrate the achievements of women in tech and discuss strategies for greater inclusion.',
          views: '3.1k',
          endDate: '2023-11-20',
      },
      {
          image: 'https://cdn.pixabay.com/photo/2018/05/17/16/03/compass-3408928_1280.jpg',
          title: 'Future of Work Symposium',
          organizer: 'Global Workforce Alliance',
          shortDescription: 'Exploring the future of work.',
          description: 'Discuss how technology and automation are reshaping the workplace.',
          views: '2.6k',
          endDate: '2023-12-07',
      },
      {
          image: 'https://cdn.pixabay.com/photo/2020/05/25/08/54/banner-5217681_1280.jpg',
          title: 'Data Privacy & Ethics Forum',
          organizer: 'Digital Ethics Council',
          shortDescription: 'A forum on data privacy.',
          description: 'Explore the ethical implications of data collection and usage in the digital age.',
          views: '2.4k',
          endDate: '2023-11-29',
      },
      {
          image: 'https://cdn.pixabay.com/photo/2016/11/22/19/15/audience-1850119_1280.jpg',
          title: 'Global Film Festival',
          organizer: 'Cinema Arts Society',
          shortDescription: 'Celebrating global cinema.',
          description: 'Enjoy screenings and discussions with filmmakers from around the world.',
          views: '4.0k',
          endDate: '2023-12-18',
      },
      {
          image: 'https://cdn.pixabay.com/photo/2023/07/28/16/41/ai-generated-8155552_1280.jpg',
          title: 'Smart Cities & IoT Expo',
          organizer: 'Urban Innovators Group',
          shortDescription: 'Exploring smart city technologies.',
          description: 'Learn how IoT and AI are transforming urban living at this expo.',
          views: '3.5k',
          endDate: '2023-12-14',
      },
      {
          image: 'https://cdn.pixabay.com/photo/2018/05/08/08/44/artificial-intelligence-3382507_1280.jpg',
          title: 'AI for Social Good Summit',
          organizer: 'AI for Humanity',
          shortDescription: 'Using AI for social impact.',
          description: 'Discover how AI can be used to address global challenges like poverty, health, and education.',
          views: '2.8k',
          endDate: '2023-12-22',
      }

]);


  const addOpportunity = (opp: Opportunity) => {
    setOpportunities((prev) => [...prev, opp]);
  };

  const deleteOpportunity = (title: string) => {
    setOpportunities((prev) => prev.filter((opp) => opp.title !== title));
  };

  const updateOpportunity = (title: string, updatedOpportunity: Opportunity) => {
    setOpportunities((prev) =>
      prev.map((opp) =>
        opp.title === title ? { ...opp, ...updatedOpportunity } : opp
      )
    );
  };

  return (
    <OpportunitiesContext.Provider
      value={{ opportunities, addOpportunity, deleteOpportunity, updateOpportunity }}
    >
      {children}
    </OpportunitiesContext.Provider>
  );
};

export const useOpportunities = () => {
  const context = useContext(OpportunitiesContext);
  if (!context) {
    throw new Error("useOpportunities must be used within an OpportunitiesProvider");
  }
  return context;
};