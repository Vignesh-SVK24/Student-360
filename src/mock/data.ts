export interface Student {
  id: string;
  registerNumber: string;
  name: string;
  department: string;
  course: string;
  year: string;
  section: string;
  attendance: number;
  cgpa: number;
  image: string;
  email?: string;
  phone?: string;
  dob?: string;
}

export const mockStudents: Student[] = [
  {
    id: "1",
    registerNumber: "23AIM001",
    name: "Arun Kumar",
    department: "AI & ML",
    course: "B.Tech Artificial Intelligence",
    year: "II",
    section: "A",
    attendance: 86,
    cgpa: 8.41,
    image: "https://ui-avatars.com/api/?name=Arun+Kumar&background=e0e7ff&color=4338ca",
    email: "arun.kumar@college.edu",
    phone: "+91 98451 23410",
    dob: "14 May 2005"
  },
  {
    id: "2",
    registerNumber: "23AIM002",
    name: "Vignesh K",
    department: "AI & ML",
    course: "B.Tech Artificial Intelligence",
    year: "II",
    section: "A",
    attendance: 67,
    cgpa: 7.2,
    image: "https://ui-avatars.com/api/?name=Vignesh+K&background=f3e8ff&color=9333ea",
    email: "vignesh.k@college.edu",
    phone: "+91 94432 87654",
    dob: "22 Sep 2005"
  },
  {
    id: "3",
    registerNumber: "23CSE045",
    name: "Sarah Jane",
    department: "Computer Science",
    course: "B.Tech CSE",
    year: "III",
    section: "B",
    attendance: 92,
    cgpa: 9.1,
    image: "https://ui-avatars.com/api/?name=Sarah+Jane&background=fce7f3&color=be185d",
    email: "sarah.jane@college.edu",
    phone: "+91 97890 12345",
    dob: "08 Dec 2004"
  },
  {
    id: "4",
    registerNumber: "23ECE012",
    name: "Rahul Sharma",
    department: "Electronics",
    course: "B.Tech ECE",
    year: "II",
    section: "C",
    attendance: 74,
    cgpa: 6.8,
    image: "https://ui-avatars.com/api/?name=Rahul+Sharma&background=fef3c7&color=b45309",
    email: "rahul.sharma@college.edu",
    phone: "+91 98765 43210",
    dob: "19 Mar 2005"
  }
];
