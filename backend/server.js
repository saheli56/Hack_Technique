const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const twilio = require('twilio');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Twilio client (will be used when credentials are available)
// Only initialize if valid credentials are provided
const twilioClient = (process.env.TWILIO_ACCOUNT_SID && 
                     process.env.TWILIO_AUTH_TOKEN &&
                     process.env.TWILIO_ACCOUNT_SID.startsWith('AC'))
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

if (!twilioClient) {
  console.log('⚠️  Twilio not configured. IVR features will be disabled.');
  console.log('   Follow IVR_SETUP_GUIDE.md to enable phone-based IVR.');
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // For Twilio webhook data

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

const jobSchema = new mongoose.Schema({
  title: String,
  titleHi: String,
  company: String,
  location: String,
  salary: String,
  type: String,
  description: String,
  requirements: [String],
  employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employer' },
  posted: String,
  verified: Boolean,
  applicants: Number,
  createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  skills: [String],
  location: String,
  createdAt: { type: Date, default: Date.now }
});

const employerSchema = new mongoose.Schema({
  companyName: String,
  contactPerson: String,
  phone: String,
  email: String,
  companyType: String,
  location: String,
  description: String,
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'pending' },
  appliedAt: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
  title: String,
  titleHi: String,
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  category: String,
  likes: { type: Number, default: 0 },
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: String,
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

const loanSchema = new mongoose.Schema({
  name: String,
  provider: String,
  amount: String,
  interest: String,
  tenure: String,
  processing: String,
  rating: Number,
  createdAt: { type: Date, default: Date.now }
});

// IVR Call tracking schema
const ivrCallSchema = new mongoose.Schema({
  callSid: String, // Twilio Call SID
  from: String, // Caller's phone number
  to: String, // IVR phone number
  language: { type: String, default: 'hi' }, // Selected language
  currentState: String, // Current menu state
  callStatus: String, // active, completed, failed
  startTime: { type: Date, default: Date.now },
  endTime: Date,
  duration: Number, // in seconds
  selectedCity: String,
  selectedJobType: String,
  actions: [{
    timestamp: { type: Date, default: Date.now },
    state: String,
    input: String,
    response: String
  }],
  createdAt: { type: Date, default: Date.now }
});

const Job = mongoose.model('Job', jobSchema);
const User = mongoose.model('User', userSchema);
const Employer = mongoose.model('Employer', employerSchema);
const Application = mongoose.model('Application', applicationSchema);
const Post = mongoose.model('Post', postSchema);
const Loan = mongoose.model('Loan', loanSchema);
const IVRCall = mongoose.model('IVRCall', ivrCallSchema);

app.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/jobs', async (req, res) => {
  try {
    const { employerId, ...jobData } = req.body;

    if (!employerId) {
      return res.status(400).json({ error: 'Employer ID is required' });
    }

    const job = new Job({
      ...jobData,
      employerId: new mongoose.Types.ObjectId(employerId)
    });

    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/jobs/employer/:employerId', async (req, res) => {
  try {
    const jobs = await Job.find({ employerId: req.params.employerId });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/jobs/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if the employer owns this job
    const employerId = req.body.employerId;
    if (job.employerId.toString() !== employerId) {
      return res.status(403).json({ error: 'You can only update your own jobs' });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/jobs/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if the employer owns this job
    const employerId = req.query.employerId;
    if (job.employerId.toString() !== employerId) {
      return res.status(403).json({ error: 'You can only delete your own jobs' });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users/login', async (req, res) => {
  try {
    const { email, phone } = req.body;
    const user = await User.findOne({
      $or: [
        { email: email },
        { phone: phone }
      ]
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        skills: user.skills,
        location: user.location
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Employer endpoints
app.get('/api/employers', async (req, res) => {
  try {
    const employers = await Employer.find();
    res.json(employers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/employers', async (req, res) => {
  try {
    const employer = new Employer(req.body);
    await employer.save();
    res.status(201).json(employer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/employers/login', async (req, res) => {
  try {
    const { email, phone } = req.body;
    const employer = await Employer.findOne({
      $or: [
        { email: email },
        { phone: phone }
      ]
    });

    if (!employer) {
      return res.status(401).json({ error: 'Employer not found' });
    }

    res.json({
      employer: {
        _id: employer._id,
        companyName: employer.companyName,
        contactPerson: employer.contactPerson,
        email: employer.email,
        phone: employer.phone,
        companyType: employer.companyType,
        location: employer.location,
        verified: employer.verified
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/employers/:id', async (req, res) => {
  try {
    const employer = await Employer.findById(req.params.id);
    res.json(employer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/applications', async (req, res) => {
  try {
    const applications = await Application.find().populate('jobId').populate('userId');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/applications', async (req, res) => {
  try {
    const applicationData = {
      jobId: new mongoose.Types.ObjectId(req.body.jobId),
      userId: new mongoose.Types.ObjectId(req.body.userId),
      status: req.body.status || 'pending',
      appliedAt: new Date()
    };
    const application = new Application(applicationData);
    await application.save();
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/applications/user/:userId', async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.params.userId }).populate('jobId', 'title titleHi company location salary type');
    console.log('Applications found:', applications.length);
    console.log('First application:', applications[0]);
    res.json(applications);
  } catch (error) {
    console.log('Error fetching applications:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/applications/job/:jobId', async (req, res) => {
  try {
    const applications = await Application.find({ jobId: req.params.jobId }).populate('userId', 'name phone email skills location');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/applications/:id/status', async (req, res) => {
  try {
    const { status, employerId } = req.body;

    // Find the application and populate job to check employer ownership
    const application = await Application.findById(req.params.id).populate('jobId');
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Check if the employer owns this job
    if (application.jobId.employerId.toString() !== employerId) {
      return res.status(403).json({ error: 'You can only update applications for your own jobs' });
    }

    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('userId', 'name phone email skills location').populate('jobId', 'title company');

    res.json(updatedApplication);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/debug/applications/:userId', async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.params.userId });
    const populatedApplications = await Application.find({ userId: req.params.userId }).populate('jobId', 'title titleHi company location salary type');
    console.log('Raw applications:', applications);
    console.log('Populated applications:', populatedApplications);
    res.json({ raw: applications, populated: populatedApplications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/migrate/applications', async (req, res) => {
  try {
    const applications = await Application.find({});
    let updated = 0;

    for (const app of applications) {
      let needsSave = false;
      if (app.jobId && typeof app.jobId === 'string') {
        app.jobId = new mongoose.Types.ObjectId(app.jobId);
        needsSave = true;
      }
      if (app.userId && typeof app.userId === 'string') {
        app.userId = new mongoose.Types.ObjectId(app.userId);
        needsSave = true;
      }
      if (needsSave) {
        await app.save();
        updated++;
      }
    }

    res.json({ message: `Migrated ${updated} applications` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find().populate('author').sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/posts', async (req, res) => {
  try {
    const post = new Post(req.body);
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/posts/:id/comments', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    post.comments.push(req.body);
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/posts/:id/like', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    post.likes += 1;
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if the user is the author of the post
    const userId = req.query.userId;
    console.log('Post author:', post.author, 'User ID:', userId);
    console.log('Author type:', typeof post.author, 'UserId type:', typeof userId);

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    if (post.author.toString() !== userId) {
      return res.status(403).json({ error: 'You can only delete your own posts' });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/loans', async (req, res) => {
  try {
    const loans = await Loan.find();
    res.json(loans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/loans', async (req, res) => {
  try {
    const loan = new Loan(req.body);
    await loan.save();
    res.status(201).json(loan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/seed', async (req, res) => {
  try {
    const { reset = false } = req.body;

    // Check if data already exists
    const existingJobs = await Job.countDocuments();
    const existingUsers = await User.countDocuments();
    const existingEmployers = await Employer.countDocuments();

    if (existingJobs > 0 || existingUsers > 0 || existingEmployers > 0) {
      if (!reset) {
        return res.status(400).json({
          error: 'Database already contains data. Use { "reset": true } to clear and reseed, or use /api/seed/demo to add demo data without clearing existing data.'
        });
      }
      // Only reset if explicitly requested
      await Job.deleteMany({});
      await User.deleteMany({});
      await Employer.deleteMany({});
      await Application.deleteMany({});
      await Post.deleteMany({});
      await Loan.deleteMany({});
    }

    // Create sample employers
    const employers = [
      {
        companyName: "ABC Constructions",
        contactPerson: "Rajesh Kumar",
        phone: "9876543210",
        email: "rajesh@abcconstructions.com",
        companyType: "Construction",
        location: "Mumbai",
        description: "Leading construction company in Mumbai",
        verified: true
      },
      {
        companyName: "XYZ Manufacturing",
        contactPerson: "Priya Sharma",
        phone: "9876543211",
        email: "priya@xyzmanufacturing.com",
        companyType: "Manufacturing",
        location: "Pune",
        description: "Manufacturing unit specializing in textiles",
        verified: true
      },
      {
        companyName: "Quick Delivery",
        contactPerson: "Amit Singh",
        phone: "9876543212",
        email: "amit@quickdelivery.com",
        companyType: "Logistics",
        location: "Delhi",
        description: "Fast delivery services across Delhi NCR",
        verified: true
      },
      {
        companyName: "Bangalore Builders",
        contactPerson: "Suresh Reddy",
        phone: "9876543213",
        email: "suresh@bangalorebuilders.com",
        companyType: "Construction",
        location: "Bangalore",
        description: "Infrastructure development company",
        verified: true
      },
      {
        companyName: "Chennai Textiles",
        contactPerson: "Kavita Iyer",
        phone: "9876543214",
        email: "kavita@chennaitextiles.com",
        companyType: "Manufacturing",
        location: "Chennai",
        description: "Textile manufacturing and processing",
        verified: true
      },
      {
        companyName: "Hyderabad Services",
        contactPerson: "Mohammed Ali",
        phone: "9876543215",
        email: "ali@hyderabadservices.com",
        companyType: "Domestic Help",
        location: "Hyderabad",
        description: "Home and office cleaning services",
        verified: true
      },
      {
        companyName: "Kolkata Transport",
        contactPerson: "Bina Das",
        phone: "9876543216",
        email: "bina@kolkatatransport.com",
        companyType: "Driving",
        location: "Kolkata",
        description: "Transportation and logistics services",
        verified: true
      },
      {
        companyName: "Ahmedabad Security",
        contactPerson: "Raj Patel",
        phone: "9876543217",
        email: "raj@ahmedabadsecurity.com",
        companyType: "Security",
        location: "Ahmedabad",
        description: "Security services for residential and commercial",
        verified: true
      },
      {
        companyName: "Surat Logistics",
        contactPerson: "Meera Shah",
        phone: "9876543218",
        email: "meera@suratlogistics.com",
        companyType: "Delivery",
        location: "Surat",
        description: "Courier and delivery services",
        verified: true
      },
      {
        companyName: "Jaipur Farms",
        contactPerson: "Ravi Singh",
        phone: "9876543219",
        email: "ravi@jaipurfarms.com",
        companyType: "Farming",
        location: "Jaipur",
        description: "Agricultural and farming operations",
        verified: true
      }
    ];

    const createdEmployers = await Employer.insertMany(employers);

    const jobs = [
      // Mumbai Jobs
      {
        title: "Construction Worker",
        titleHi: "निर्माण मजदूर",
        company: "ABC Constructions",
        location: "Mumbai",
        salary: "₹15,000 - ₹20,000/month",
        type: "Full Time",
        description: "Looking for experienced construction workers for building projects",
        requirements: ["Physical fitness", "Construction experience"],
        employerId: createdEmployers[0]._id,
        posted: "2 days ago",
        verified: true,
        applicants: 45
      },
      {
        title: "Mason Assistant",
        titleHi: "राजगीर सहायक",
        company: "ABC Constructions",
        location: "Mumbai",
        salary: "₹18,000 - ₹22,000/month",
        type: "Full Time",
        description: "Assistant mason needed for residential construction",
        requirements: ["Basic masonry skills", "Physical fitness"],
        employerId: createdEmployers[0]._id,
        posted: "1 day ago",
        verified: true,
        applicants: 23
      },
      {
        title: "House Cleaner",
        titleHi: "घर सफाई करने वाला",
        company: "Hyderabad Services",
        location: "Mumbai",
        salary: "₹12,000 - ₹16,000/month",
        type: "Part Time",
        description: "House cleaning services for residential areas",
        requirements: ["Cleaning experience", "Reliable transportation"],
        employerId: createdEmployers[5]._id,
        posted: "3 days ago",
        verified: true,
        applicants: 31
      },

      // Delhi Jobs
      {
        title: "Delivery Executive",
        titleHi: "डिलीवरी एग्जीक्यूटिव",
        company: "Quick Delivery",
        location: "Delhi",
        salary: "₹18,000 - ₹25,000/month",
        type: "Full Time",
        description: "Delivery personnel needed for urban areas",
        requirements: ["Valid license", "Good navigation skills"],
        employerId: createdEmployers[2]._id,
        posted: "3 hours ago",
        verified: true,
        applicants: 67
      },
      {
        title: "Security Guard",
        titleHi: "सुरक्षा गार्ड",
        company: "Ahmedabad Security",
        location: "Delhi",
        salary: "₹14,000 - ₹18,000/month",
        type: "Full Time",
        description: "Security personnel for commercial buildings",
        requirements: ["Security training", "Physical fitness"],
        employerId: createdEmployers[7]._id,
        posted: "5 days ago",
        verified: true,
        applicants: 19
      },
      {
        title: "Office Cleaner",
        titleHi: "कार्यालय सफाई करने वाला",
        company: "Hyderabad Services",
        location: "Delhi",
        salary: "₹13,000 - ₹17,000/month",
        type: "Full Time",
        description: "Office cleaning and maintenance services",
        requirements: ["Cleaning experience", "Attention to detail"],
        employerId: createdEmployers[5]._id,
        posted: "1 day ago",
        verified: true,
        applicants: 28
      },

      // Bangalore Jobs
      {
        title: "Construction Laborer",
        titleHi: "निर्माण श्रमिक",
        company: "Bangalore Builders",
        location: "Bangalore",
        salary: "₹16,000 - ₹21,000/month",
        type: "Full Time",
        description: "General construction labor for infrastructure projects",
        requirements: ["Physical fitness", "Basic tools knowledge"],
        employerId: createdEmployers[3]._id,
        posted: "4 days ago",
        verified: true,
        applicants: 52
      },
      {
        title: "Driver",
        titleHi: "ड्राइवर",
        company: "Kolkata Transport",
        location: "Bangalore",
        salary: "₹20,000 - ₹28,000/month",
        type: "Full Time",
        description: "Commercial vehicle driver for goods transportation",
        requirements: ["Valid commercial license", "Driving experience"],
        employerId: createdEmployers[6]._id,
        posted: "2 days ago",
        verified: true,
        applicants: 34
      },
      {
        title: "Hotel Housekeeper",
        titleHi: "होटल हाउसकीपर",
        company: "Bangalore Builders",
        location: "Bangalore",
        salary: "₹11,000 - ₹15,000/month",
        type: "Full Time",
        description: "Housekeeping services for hotel rooms",
        requirements: ["Cleaning experience", "Customer service skills"],
        employerId: createdEmployers[3]._id,
        posted: "6 days ago",
        verified: true,
        applicants: 41
      },

      // Chennai Jobs
      {
        title: "Textile Worker",
        titleHi: "कपड़ा मजदूर",
        company: "Chennai Textiles",
        location: "Chennai",
        salary: "₹14,000 - ₹19,000/month",
        type: "Full Time",
        description: "Textile processing and manufacturing work",
        requirements: ["Manufacturing experience", "Attention to detail"],
        employerId: createdEmployers[4]._id,
        posted: "1 day ago",
        verified: true,
        applicants: 38
      },
      {
        title: "Warehouse Worker",
        titleHi: "गोदाम मजदूर",
        company: "Chennai Textiles",
        location: "Chennai",
        salary: "₹13,000 - ₹17,000/month",
        type: "Full Time",
        description: "Warehouse operations and inventory management",
        requirements: ["Physical fitness", "Basic inventory knowledge"],
        employerId: createdEmployers[4]._id,
        posted: "3 days ago",
        verified: true,
        applicants: 26
      },
      {
        title: "Delivery Boy",
        titleHi: "डिलीवरी बॉय",
        company: "Surat Logistics",
        location: "Chennai",
        salary: "₹15,000 - ₹20,000/month",
        type: "Full Time",
        description: "Package delivery services in Chennai",
        requirements: ["Two-wheeler license", "Navigation skills"],
        employerId: createdEmployers[8]._id,
        posted: "5 days ago",
        verified: true,
        applicants: 47
      },

      // Hyderabad Jobs
      {
        title: "Domestic Helper",
        titleHi: "घरेलू सहायक",
        company: "Hyderabad Services",
        location: "Hyderabad",
        salary: "₹10,000 - ₹14,000/month",
        type: "Full Time",
        description: "House cleaning and household assistance",
        requirements: ["Cleaning experience", "Reliable"],
        employerId: createdEmployers[5]._id,
        posted: "2 days ago",
        verified: true,
        applicants: 55
      },
      {
        title: "Construction Helper",
        titleHi: "निर्माण सहायक",
        company: "Bangalore Builders",
        location: "Hyderabad",
        salary: "₹15,000 - ₹19,000/month",
        type: "Full Time",
        description: "Construction site assistance and material handling",
        requirements: ["Physical fitness", "Basic construction knowledge"],
        employerId: createdEmployers[3]._id,
        posted: "4 days ago",
        verified: true,
        applicants: 29
      },
      {
        title: "Security Personnel",
        titleHi: "सुरक्षा कर्मी",
        company: "Ahmedabad Security",
        location: "Hyderabad",
        salary: "₹16,000 - ₹20,000/month",
        type: "Full Time",
        description: "Security services for residential complexes",
        requirements: ["Security training", "24/7 availability"],
        employerId: createdEmployers[7]._id,
        posted: "1 day ago",
        verified: true,
        applicants: 33
      },

      // Pune Jobs
      {
        title: "Factory Worker",
        titleHi: "फैक्ट्री वर्कर",
        company: "XYZ Manufacturing",
        location: "Pune",
        salary: "₹12,000 - ₹18,000/month",
        type: "Full Time",
        description: "Manufacturing unit requires skilled workers",
        requirements: ["Manufacturing experience", "Basic tools knowledge"],
        employerId: createdEmployers[1]._id,
        posted: "1 day ago",
        verified: true,
        applicants: 28
      },
      {
        title: "Quality Inspector",
        titleHi: "गुणवत्ता निरीक्षक",
        company: "XYZ Manufacturing",
        location: "Pune",
        salary: "₹17,000 - ₹22,000/month",
        type: "Full Time",
        description: "Quality control and inspection of manufactured goods",
        requirements: ["Quality control experience", "Attention to detail"],
        employerId: createdEmployers[1]._id,
        posted: "3 days ago",
        verified: true,
        applicants: 16
      },
      {
        title: "Delivery Driver",
        titleHi: "डिलीवरी ड्राइवर",
        company: "Quick Delivery",
        location: "Pune",
        salary: "₹19,000 - ₹26,000/month",
        type: "Full Time",
        description: "Commercial delivery services across Pune",
        requirements: ["Valid license", "Local area knowledge"],
        employerId: createdEmployers[2]._id,
        posted: "6 days ago",
        verified: true,
        applicants: 42
      },

      // Kolkata Jobs
      {
        title: "Taxi Driver",
        titleHi: "टैक्सी ड्राइवर",
        company: "Kolkata Transport",
        location: "Kolkata",
        salary: "₹16,000 - ₹24,000/month",
        type: "Full Time",
        description: "Taxi services for passengers in Kolkata",
        requirements: ["Valid license", "City knowledge"],
        employerId: createdEmployers[6]._id,
        posted: "2 days ago",
        verified: true,
        applicants: 38
      },
      {
        title: "Warehouse Assistant",
        titleHi: "गोदाम सहायक",
        company: "Surat Logistics",
        location: "Kolkata",
        salary: "₹12,000 - ₹16,000/month",
        type: "Full Time",
        description: "Warehouse operations and goods handling",
        requirements: ["Physical fitness", "Basic inventory skills"],
        employerId: createdEmployers[8]._id,
        posted: "4 days ago",
        verified: true,
        applicants: 24
      },
      {
        title: "Hotel Staff",
        titleHi: "होटल स्टाफ",
        company: "Bangalore Builders",
        location: "Kolkata",
        salary: "₹13,000 - ₹18,000/month",
        type: "Full Time",
        description: "Hotel front desk and guest services",
        requirements: ["Customer service skills", "Basic English"],
        employerId: createdEmployers[3]._id,
        posted: "5 days ago",
        verified: true,
        applicants: 31
      },

      // Ahmedabad Jobs
      {
        title: "Security Officer",
        titleHi: "सुरक्षा अधिकारी",
        company: "Ahmedabad Security",
        location: "Ahmedabad",
        salary: "₹15,000 - ₹19,000/month",
        type: "Full Time",
        description: "Security services for industrial areas",
        requirements: ["Security certification", "Physical fitness"],
        employerId: createdEmployers[7]._id,
        posted: "3 days ago",
        verified: true,
        applicants: 27
      },
      {
        title: "Manufacturing Assistant",
        titleHi: "विनिर्माण सहायक",
        company: "XYZ Manufacturing",
        location: "Ahmedabad",
        salary: "₹14,000 - ₹18,000/month",
        type: "Full Time",
        description: "Assembly line work in manufacturing unit",
        requirements: ["Manufacturing experience", "Team work"],
        employerId: createdEmployers[1]._id,
        posted: "1 day ago",
        verified: true,
        applicants: 35
      },
      {
        title: "Courier Delivery",
        titleHi: "कूरियर डिलीवरी",
        company: "Surat Logistics",
        location: "Ahmedabad",
        salary: "₹14,000 - ₹19,000/month",
        type: "Full Time",
        description: "Courier and package delivery services",
        requirements: ["Two-wheeler license", "Time management"],
        employerId: createdEmployers[8]._id,
        posted: "2 days ago",
        verified: true,
        applicants: 29
      },

      // Surat Jobs
      {
        title: "Logistics Worker",
        titleHi: "रसद मजदूर",
        company: "Surat Logistics",
        location: "Surat",
        salary: "₹13,000 - ₹17,000/month",
        type: "Full Time",
        description: "Goods loading and unloading at logistics center",
        requirements: ["Physical fitness", "Team work"],
        employerId: createdEmployers[8]._id,
        posted: "4 days ago",
        verified: true,
        applicants: 22
      },
      {
        title: "Textile Helper",
        titleHi: "कपड़ा सहायक",
        company: "Chennai Textiles",
        location: "Surat",
        salary: "₹12,000 - ₹16,000/month",
        type: "Full Time",
        description: "Textile processing and quality checking",
        requirements: ["Basic textile knowledge", "Attention to detail"],
        employerId: createdEmployers[4]._id,
        posted: "3 days ago",
        verified: true,
        applicants: 18
      },
      {
        title: "Housekeeping",
        titleHi: "गृहस्थी",
        company: "Hyderabad Services",
        location: "Surat",
        salary: "₹11,000 - ₹15,000/month",
        type: "Part Time",
        description: "Residential and commercial cleaning services",
        requirements: ["Cleaning experience", "Reliable"],
        employerId: createdEmployers[5]._id,
        posted: "5 days ago",
        verified: true,
        applicants: 25
      },

      // Jaipur Jobs
      {
        title: "Farm Worker",
        titleHi: "खेत मजदूर",
        company: "Jaipur Farms",
        location: "Jaipur",
        salary: "₹10,000 - ₹14,000/month",
        type: "Seasonal",
        description: "Agricultural work including planting and harvesting",
        requirements: ["Farming experience", "Physical fitness"],
        employerId: createdEmployers[9]._id,
        posted: "1 day ago",
        verified: true,
        applicants: 41
      },
      {
        title: "Construction Site Worker",
        titleHi: "निर्माण स्थल मजदूर",
        company: "ABC Constructions",
        location: "Jaipur",
        salary: "₹14,000 - ₹18,000/month",
        type: "Full Time",
        description: "Construction work for residential projects",
        requirements: ["Construction experience", "Safety awareness"],
        employerId: createdEmployers[0]._id,
        posted: "6 days ago",
        verified: true,
        applicants: 33
      },
      {
        title: "Delivery Services",
        titleHi: "डिलीवरी सेवाएं",
        company: "Quick Delivery",
        location: "Jaipur",
        salary: "₹16,000 - ₹22,000/month",
        type: "Full Time",
        description: "Package delivery across Jaipur city",
        requirements: ["Valid license", "City navigation"],
        employerId: createdEmployers[2]._id,
        posted: "2 days ago",
        verified: true,
        applicants: 37
      }
    ];

    const loans = [
      {
        name: "Quick Cash Loan",
        provider: "MicroFinance India",
        amount: "₹5,000 - ₹50,000",
        interest: "12% - 18% p.a.",
        tenure: "3 - 12 months",
        processing: "24 hours",
        rating: 4.5
      },
      {
        name: "Worker Emergency Loan",
        provider: "Shramik Bank",
        amount: "₹10,000 - ₹1,00,000",
        interest: "10% - 15% p.a.",
        tenure: "6 - 24 months",
        processing: "48 hours",
        rating: 4.8
      }
    ];

    await Job.insertMany(jobs);
    await Loan.insertMany(loans);

    res.json({ message: 'Database seeded successfully with employers and jobs' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Demo endpoint to add demo jobs without clearing existing data
app.post('/api/seed/demo', async (req, res) => {
  try {
    // Check if demo employers already exist
    const existingDemoEmployers = await Employer.countDocuments({ email: { $regex: /demo\./ } });

    if (existingDemoEmployers > 0) {
      return res.status(400).json({
        error: 'Demo data already exists. Use /api/seed with { "reset": true } to clear all data first.'
      });
    }

    // Create demo employers (with demo. prefix to distinguish from real data)
    const demoEmployers = [
      {
        companyName: "ABC Constructions",
        contactPerson: "Rajesh Kumar",
        phone: "9876543210",
        email: "demo.abc@constructions.com",
        companyType: "Construction",
        location: "Mumbai",
        description: "Leading construction company in Mumbai",
        verified: true
      },
      {
        companyName: "XYZ Manufacturing",
        contactPerson: "Priya Sharma",
        phone: "9876543211",
        email: "demo.xyz@manufacturing.com",
        companyType: "Manufacturing",
        location: "Pune",
        description: "Manufacturing unit specializing in textiles",
        verified: true
      },
      {
        companyName: "Quick Delivery",
        contactPerson: "Amit Singh",
        phone: "9876543212",
        email: "demo.quick@delivery.com",
        companyType: "Logistics",
        location: "Delhi",
        description: "Fast delivery services across Delhi NCR",
        verified: true
      },
      {
        companyName: "Bangalore Builders",
        contactPerson: "Suresh Reddy",
        phone: "9876543213",
        email: "demo.bangalore@builders.com",
        companyType: "Construction",
        location: "Bangalore",
        description: "Infrastructure development company",
        verified: true
      },
      {
        companyName: "Chennai Textiles",
        contactPerson: "Kavita Iyer",
        phone: "9876543214",
        email: "demo.chennai@textiles.com",
        companyType: "Manufacturing",
        location: "Chennai",
        description: "Textile manufacturing and processing",
        verified: true
      },
      {
        companyName: "Hyderabad Services",
        contactPerson: "Mohammed Ali",
        phone: "9876543215",
        email: "demo.hyderabad@services.com",
        companyType: "Domestic Help",
        location: "Hyderabad",
        description: "Home and office cleaning services",
        verified: true
      },
      {
        companyName: "Kolkata Transport",
        contactPerson: "Bina Das",
        phone: "9876543216",
        email: "demo.kolkata@transport.com",
        companyType: "Driving",
        location: "Kolkata",
        description: "Transportation and logistics services",
        verified: true
      },
      {
        companyName: "Ahmedabad Security",
        contactPerson: "Raj Patel",
        phone: "9876543217",
        email: "demo.ahmedabad@security.com",
        companyType: "Security",
        location: "Ahmedabad",
        description: "Security services for residential and commercial",
        verified: true
      },
      {
        companyName: "Surat Logistics",
        contactPerson: "Meera Shah",
        phone: "9876543218",
        email: "demo.surat@logistics.com",
        companyType: "Delivery",
        location: "Surat",
        description: "Courier and delivery services",
        verified: true
      },
      {
        companyName: "Jaipur Farms",
        contactPerson: "Ravi Singh",
        phone: "9876543219",
        email: "demo.jaipur@farms.com",
        companyType: "Farming",
        location: "Jaipur",
        description: "Agricultural and farming operations",
        verified: true
      }
    ];

    const createdDemoEmployers = await Employer.insertMany(demoEmployers);

    // Create comprehensive demo jobs for all cities
    const demoJobs = [
      // Mumbai Jobs
      {
        title: "Construction Worker",
        titleHi: "निर्माण मजदूर",
        company: "ABC Constructions",
        location: "Mumbai",
        salary: "₹15,000 - ₹20,000/month",
        type: "Full Time",
        description: "Looking for experienced construction workers for building projects",
        requirements: ["Physical fitness", "Construction experience"],
        employerId: createdDemoEmployers[0]._id,
        posted: "2 days ago",
        verified: true,
        applicants: 45
      },
      {
        title: "Mason Assistant",
        titleHi: "राजगीर सहायक",
        company: "ABC Constructions",
        location: "Mumbai",
        salary: "₹18,000 - ₹22,000/month",
        type: "Full Time",
        description: "Assistant mason needed for residential construction",
        requirements: ["Basic masonry skills", "Physical fitness"],
        employerId: createdDemoEmployers[0]._id,
        posted: "1 day ago",
        verified: true,
        applicants: 23
      },
      {
        title: "House Cleaner",
        titleHi: "घर सफाई करने वाला",
        company: "Hyderabad Services",
        location: "Mumbai",
        salary: "₹12,000 - ₹16,000/month",
        type: "Part Time",
        description: "House cleaning services for residential areas",
        requirements: ["Cleaning experience", "Reliable transportation"],
        employerId: createdDemoEmployers[5]._id,
        posted: "3 days ago",
        verified: true,
        applicants: 31
      },

      // Delhi Jobs
      {
        title: "Delivery Executive",
        titleHi: "डिलीवरी एग्जीक्यूटिव",
        company: "Quick Delivery",
        location: "Delhi",
        salary: "₹18,000 - ₹25,000/month",
        type: "Full Time",
        description: "Delivery personnel needed for urban areas",
        requirements: ["Valid license", "Good navigation skills"],
        employerId: createdDemoEmployers[2]._id,
        posted: "3 hours ago",
        verified: true,
        applicants: 67
      },
      {
        title: "Security Guard",
        titleHi: "सुरक्षा गार्ड",
        company: "Ahmedabad Security",
        location: "Delhi",
        salary: "₹14,000 - ₹18,000/month",
        type: "Full Time",
        description: "Security personnel for commercial buildings",
        requirements: ["Security training", "Physical fitness"],
        employerId: createdDemoEmployers[7]._id,
        posted: "5 days ago",
        verified: true,
        applicants: 19
      },
      {
        title: "Office Cleaner",
        titleHi: "कार्यालय सफाई करने वाला",
        company: "Hyderabad Services",
        location: "Delhi",
        salary: "₹13,000 - ₹17,000/month",
        type: "Full Time",
        description: "Office cleaning and maintenance services",
        requirements: ["Cleaning experience", "Attention to detail"],
        employerId: createdDemoEmployers[5]._id,
        posted: "1 day ago",
        verified: true,
        applicants: 28
      },

      // Bangalore Jobs
      {
        title: "Construction Laborer",
        titleHi: "निर्माण श्रमिक",
        company: "Bangalore Builders",
        location: "Bangalore",
        salary: "₹16,000 - ₹21,000/month",
        type: "Full Time",
        description: "General construction labor for infrastructure projects",
        requirements: ["Physical fitness", "Basic tools knowledge"],
        employerId: createdDemoEmployers[3]._id,
        posted: "4 days ago",
        verified: true,
        applicants: 52
      },
      {
        title: "Driver",
        titleHi: "ड्राइवर",
        company: "Kolkata Transport",
        location: "Bangalore",
        salary: "₹20,000 - ₹28,000/month",
        type: "Full Time",
        description: "Commercial vehicle driver for goods transportation",
        requirements: ["Valid commercial license", "Driving experience"],
        employerId: createdDemoEmployers[6]._id,
        posted: "2 days ago",
        verified: true,
        applicants: 34
      },
      {
        title: "Hotel Housekeeper",
        titleHi: "होटल हाउसकीपर",
        company: "Bangalore Builders",
        location: "Bangalore",
        salary: "₹11,000 - ₹15,000/month",
        type: "Full Time",
        description: "Housekeeping services for hotel rooms",
        requirements: ["Cleaning experience", "Customer service skills"],
        employerId: createdDemoEmployers[3]._id,
        posted: "6 days ago",
        verified: true,
        applicants: 41
      },

      // Chennai Jobs
      {
        title: "Textile Worker",
        titleHi: "कपड़ा मजदूर",
        company: "Chennai Textiles",
        location: "Chennai",
        salary: "₹14,000 - ₹19,000/month",
        type: "Full Time",
        description: "Textile processing and manufacturing work",
        requirements: ["Manufacturing experience", "Attention to detail"],
        employerId: createdDemoEmployers[4]._id,
        posted: "1 day ago",
        verified: true,
        applicants: 38
      },
      {
        title: "Warehouse Worker",
        titleHi: "गोदाम मजदूर",
        company: "Chennai Textiles",
        location: "Chennai",
        salary: "₹13,000 - ₹17,000/month",
        type: "Full Time",
        description: "Warehouse operations and inventory management",
        requirements: ["Physical fitness", "Basic inventory knowledge"],
        employerId: createdDemoEmployers[4]._id,
        posted: "3 days ago",
        verified: true,
        applicants: 26
      },
      {
        title: "Delivery Boy",
        titleHi: "डिलीवरी बॉय",
        company: "Surat Logistics",
        location: "Chennai",
        salary: "₹15,000 - ₹20,000/month",
        type: "Full Time",
        description: "Package delivery services in Chennai",
        requirements: ["Two-wheeler license", "Navigation skills"],
        employerId: createdDemoEmployers[8]._id,
        posted: "5 days ago",
        verified: true,
        applicants: 47
      },

      // Hyderabad Jobs
      {
        title: "Domestic Helper",
        titleHi: "घरेलू सहायक",
        company: "Hyderabad Services",
        location: "Hyderabad",
        salary: "₹10,000 - ₹14,000/month",
        type: "Full Time",
        description: "House cleaning and household assistance",
        requirements: ["Cleaning experience", "Reliable"],
        employerId: createdDemoEmployers[5]._id,
        posted: "2 days ago",
        verified: true,
        applicants: 55
      },
      {
        title: "Construction Helper",
        titleHi: "निर्माण सहायक",
        company: "Bangalore Builders",
        location: "Hyderabad",
        salary: "₹15,000 - ₹19,000/month",
        type: "Full Time",
        description: "Construction site assistance and material handling",
        requirements: ["Physical fitness", "Basic construction knowledge"],
        employerId: createdDemoEmployers[3]._id,
        posted: "4 days ago",
        verified: true,
        applicants: 29
      },
      {
        title: "Security Personnel",
        titleHi: "सुरक्षा कर्मी",
        company: "Ahmedabad Security",
        location: "Hyderabad",
        salary: "₹16,000 - ₹20,000/month",
        type: "Full Time",
        description: "Security services for residential complexes",
        requirements: ["Security training", "24/7 availability"],
        employerId: createdDemoEmployers[7]._id,
        posted: "1 day ago",
        verified: true,
        applicants: 33
      },

      // Pune Jobs
      {
        title: "Factory Worker",
        titleHi: "फैक्ट्री वर्कर",
        company: "XYZ Manufacturing",
        location: "Pune",
        salary: "₹12,000 - ₹18,000/month",
        type: "Full Time",
        description: "Manufacturing unit requires skilled workers",
        requirements: ["Manufacturing experience", "Basic tools knowledge"],
        employerId: createdDemoEmployers[1]._id,
        posted: "1 day ago",
        verified: true,
        applicants: 28
      },
      {
        title: "Quality Inspector",
        titleHi: "गुणवत्ता निरीक्षक",
        company: "XYZ Manufacturing",
        location: "Pune",
        salary: "₹17,000 - ₹22,000/month",
        type: "Full Time",
        description: "Quality control and inspection of manufactured goods",
        requirements: ["Quality control experience", "Attention to detail"],
        employerId: createdDemoEmployers[1]._id,
        posted: "3 days ago",
        verified: true,
        applicants: 16
      },
      {
        title: "Delivery Driver",
        titleHi: "डिलीवरी ड्राइवर",
        company: "Quick Delivery",
        location: "Pune",
        salary: "₹19,000 - ₹26,000/month",
        type: "Full Time",
        description: "Commercial delivery services across Pune",
        requirements: ["Valid license", "Local area knowledge"],
        employerId: createdDemoEmployers[2]._id,
        posted: "6 days ago",
        verified: true,
        applicants: 42
      },

      // Kolkata Jobs
      {
        title: "Taxi Driver",
        titleHi: "टैक्सी ड्राइवर",
        company: "Kolkata Transport",
        location: "Kolkata",
        salary: "₹16,000 - ₹24,000/month",
        type: "Full Time",
        description: "Taxi services for passengers in Kolkata",
        requirements: ["Valid license", "City knowledge"],
        employerId: createdDemoEmployers[6]._id,
        posted: "2 days ago",
        verified: true,
        applicants: 38
      },
      {
        title: "Warehouse Assistant",
        titleHi: "गोदाम सहायक",
        company: "Surat Logistics",
        location: "Kolkata",
        salary: "₹12,000 - ₹16,000/month",
        type: "Full Time",
        description: "Warehouse operations and goods handling",
        requirements: ["Physical fitness", "Basic inventory skills"],
        employerId: createdDemoEmployers[8]._id,
        posted: "4 days ago",
        verified: true,
        applicants: 24
      },
      {
        title: "Hotel Staff",
        titleHi: "होटल स्टाफ",
        company: "Bangalore Builders",
        location: "Kolkata",
        salary: "₹13,000 - ₹18,000/month",
        type: "Full Time",
        description: "Hotel front desk and guest services",
        requirements: ["Customer service skills", "Basic English"],
        employerId: createdDemoEmployers[3]._id,
        posted: "5 days ago",
        verified: true,
        applicants: 31
      },

      // Ahmedabad Jobs
      {
        title: "Security Officer",
        titleHi: "सुरक्षा अधिकारी",
        company: "Ahmedabad Security",
        location: "Ahmedabad",
        salary: "₹15,000 - ₹19,000/month",
        type: "Full Time",
        description: "Security services for industrial areas",
        requirements: ["Security certification", "Physical fitness"],
        employerId: createdDemoEmployers[7]._id,
        posted: "3 days ago",
        verified: true,
        applicants: 27
      },
      {
        title: "Manufacturing Assistant",
        titleHi: "विनिर्माण सहायक",
        company: "XYZ Manufacturing",
        location: "Ahmedabad",
        salary: "₹14,000 - ₹18,000/month",
        type: "Full Time",
        description: "Assembly line work in manufacturing unit",
        requirements: ["Manufacturing experience", "Team work"],
        employerId: createdDemoEmployers[1]._id,
        posted: "1 day ago",
        verified: true,
        applicants: 35
      },
      {
        title: "Courier Delivery",
        titleHi: "कूरियर डिलीवरी",
        company: "Surat Logistics",
        location: "Ahmedabad",
        salary: "₹14,000 - ₹19,000/month",
        type: "Full Time",
        description: "Courier and package delivery services",
        requirements: ["Two-wheeler license", "Time management"],
        employerId: createdDemoEmployers[8]._id,
        posted: "2 days ago",
        verified: true,
        applicants: 29
      },

      // Surat Jobs
      {
        title: "Logistics Worker",
        titleHi: "रसद मजदूर",
        company: "Surat Logistics",
        location: "Surat",
        salary: "₹13,000 - ₹17,000/month",
        type: "Full Time",
        description: "Goods loading and unloading at logistics center",
        requirements: ["Physical fitness", "Team work"],
        employerId: createdDemoEmployers[8]._id,
        posted: "4 days ago",
        verified: true,
        applicants: 22
      },
      {
        title: "Textile Helper",
        titleHi: "कपड़ा सहायक",
        company: "Chennai Textiles",
        location: "Surat",
        salary: "₹12,000 - ₹16,000/month",
        type: "Full Time",
        description: "Textile processing and quality checking",
        requirements: ["Basic textile knowledge", "Attention to detail"],
        employerId: createdDemoEmployers[4]._id,
        posted: "3 days ago",
        verified: true,
        applicants: 18
      },
      {
        title: "Housekeeping",
        titleHi: "गृहस्थी",
        company: "Hyderabad Services",
        location: "Surat",
        salary: "₹11,000 - ₹15,000/month",
        type: "Part Time",
        description: "Residential and commercial cleaning services",
        requirements: ["Cleaning experience", "Reliable"],
        employerId: createdDemoEmployers[5]._id,
        posted: "5 days ago",
        verified: true,
        applicants: 25
      },

      // Jaipur Jobs
      {
        title: "Farm Worker",
        titleHi: "खेत मजदूर",
        company: "Jaipur Farms",
        location: "Jaipur",
        salary: "₹10,000 - ₹14,000/month",
        type: "Seasonal",
        description: "Agricultural work including planting and harvesting",
        requirements: ["Farming experience", "Physical fitness"],
        employerId: createdDemoEmployers[9]._id,
        posted: "1 day ago",
        verified: true,
        applicants: 41
      },
      {
        title: "Construction Site Worker",
        titleHi: "निर्माण स्थल मजदूर",
        company: "ABC Constructions",
        location: "Jaipur",
        salary: "₹14,000 - ₹18,000/month",
        type: "Full Time",
        description: "Construction work for residential projects",
        requirements: ["Construction experience", "Safety awareness"],
        employerId: createdDemoEmployers[0]._id,
        posted: "6 days ago",
        verified: true,
        applicants: 33
      },
      {
        title: "Delivery Services",
        titleHi: "डिलीवरी सेवाएं",
        company: "Quick Delivery",
        location: "Jaipur",
        salary: "₹16,000 - ₹22,000/month",
        type: "Full Time",
        description: "Package delivery across Jaipur city",
        requirements: ["Valid license", "City navigation"],
        employerId: createdDemoEmployers[2]._id,
        posted: "2 days ago",
        verified: true,
        applicants: 37
      }
    ];

    await Job.insertMany(demoJobs);

    res.json({ message: 'Demo data added successfully - 30 jobs across 10 cities for comprehensive job searching functionality' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// IVR ENDPOINTS FOR TWILIO INTEGRATION
// ============================================

// IVR Voice prompts in multiple languages
const IVR_PROMPTS = {
  welcome: {
    hi: 'नमस्ते! श्रमिक मित्र में आपका स्वागत है। हिंदी के लिए 1 दबाएं, अंग्रेजी के लिए 2 दबाएं।',
    en: 'Hello! Welcome to Shramik Mitra. Press 1 for Hindi, Press 2 for English.'
  },
  mainMenu: {
    hi: 'मुख्य मेनू। नौकरी खोजने के लिए 1 दबाएं। कानूनी मदद के लिए 2 दबाएं। लोन जानकारी के लिए 3 दबाएं। एजेंट से बात करने के लिए 0 दबाएं।',
    en: 'Main menu. Press 1 for job search. Press 2 for legal help. Press 3 for loan information. Press 0 to speak to an agent.'
  },
  citySelection: {
    hi: 'कृपया शहर चुनें। मुंबई के लिए 1, दिल्ली के लिए 2, बेंगलुरु के लिए 3, चेन्नई के लिए 4, हैदराबाद के लिए 5, पुणे के लिए 6 दबाएं।',
    en: 'Please select a city. Press 1 for Mumbai, 2 for Delhi, 3 for Bangalore, 4 for Chennai, 5 for Hyderabad, 6 for Pune.'
  },
  jobTypeSelection: {
    hi: 'नौकरी का प्रकार चुनें। निर्माण के लिए 1, डिलीवरी के लिए 2, सुरक्षा के लिए 3, सफाई के लिए 4, ड्राइवर के लिए 5 दबाएं।',
    en: 'Select job type. Press 1 for Construction, 2 for Delivery, 3 for Security, 4 for Cleaning, 5 for Driving.'
  },
  noJobs: {
    hi: 'क्षमा करें, इस शहर में कोई नौकरी उपलब्ध नहीं है। मुख्य मेनू के लिए स्टार दबाएं।',
    en: 'Sorry, no jobs available in this city. Press star to return to main menu.'
  },
  legalHelp: {
    hi: 'कानूनी मदद। न्यूनतम मजदूरी जानकारी के लिए 1, काम के घंटे के लिए 2, सुरक्षा अधिकार के लिए 3 दबाएं।',
    en: 'Legal help. Press 1 for minimum wage info, 2 for working hours, 3 for safety rights.'
  },
  loanInfo: {
    hi: 'लोन जानकारी। पात्रता जांचने के लिए 1, लोन प्रकार के लिए 2, आवेदन प्रक्रिया के लिए 3 दबाएं।',
    en: 'Loan information. Press 1 to check eligibility, 2 for loan types, 3 for application process.'
  },
  invalidInput: {
    hi: 'गलत इनपुट। कृपया फिर से प्रयास करें।',
    en: 'Invalid input. Please try again.'
  },
  goodbye: {
    hi: 'धन्यवाद! श्रमिक मित्र को कॉल करने के लिए शुक्रिया। अलविदा!',
    en: 'Thank you for calling Shramik Mitra. Goodbye!'
  }
};

// City mapping
const CITIES = {
  '1': 'Mumbai',
  '2': 'Delhi',
  '3': 'Bangalore',
  '4': 'Chennai',
  '5': 'Hyderabad',
  '6': 'Pune'
};

// Job type keywords
const JOB_TYPES = {
  '1': 'Construction',
  '2': 'Delivery',
  '3': 'Security',
  '4': 'Cleaning',
  '5': 'Driver'
};

// Main IVR webhook - handles incoming calls
app.post('/api/ivr/incoming', async (req, res) => {
  try {
    const twiml = new twilio.twiml.VoiceResponse();
    const callSid = req.body.CallSid;
    const from = req.body.From;
    const to = req.body.To;

    // Create call record
    const ivrCall = new IVRCall({
      callSid,
      from,
      to,
      currentState: 'welcome',
      callStatus: 'active'
    });
    await ivrCall.save();

    // Welcome message and language selection
    const gather = twiml.gather({
      numDigits: 1,
      action: '/api/ivr/language-selection',
      method: 'POST'
    });

    gather.say({
      voice: 'Google.hi-IN-Standard-A',
      language: 'hi-IN'
    }, IVR_PROMPTS.welcome.hi);

    gather.say({
      voice: 'Google.en-IN-Standard-A', 
      language: 'en-IN'
    }, IVR_PROMPTS.welcome.en);

    // If no input, repeat
    twiml.redirect('/api/ivr/incoming');

    res.type('text/xml');
    res.send(twiml.toString());
  } catch (error) {
    console.error('IVR incoming error:', error);
    res.status(500).send('Error processing call');
  }
});

// Handle language selection
app.post('/api/ivr/language-selection', async (req, res) => {
  try {
    const twiml = new twilio.twiml.VoiceResponse();
    const digit = req.body.Digits;
    const callSid = req.body.CallSid;

    let language = digit === '1' ? 'hi' : digit === '2' ? 'en' : null;

    if (!language) {
      // Invalid input
      twiml.say('Invalid selection. Please try again.');
      twiml.redirect('/api/ivr/incoming');
      res.type('text/xml');
      return res.send(twiml.toString());
    }

    // Update call record
    await IVRCall.findOneAndUpdate(
      { callSid },
      { 
        language,
        currentState: 'main_menu',
        $push: { actions: { state: 'language_selection', input: digit, response: language } }
      }
    );

    // Play main menu
    const gather = twiml.gather({
      numDigits: 1,
      action: `/api/ivr/main-menu?lang=${language}`,
      method: 'POST'
    });

    const voiceConfig = {
      voice: language === 'hi' ? 'Google.hi-IN-Standard-A' : 'Google.en-IN-Standard-A',
      language: language === 'hi' ? 'hi-IN' : 'en-IN'
    };

    gather.say(voiceConfig, IVR_PROMPTS.mainMenu[language]);

    twiml.redirect(`/api/ivr/main-menu?lang=${language}`);

    res.type('text/xml');
    res.send(twiml.toString());
  } catch (error) {
    console.error('Language selection error:', error);
    res.status(500).send('Error');
  }
});

// Handle main menu selection
app.post('/api/ivr/main-menu', async (req, res) => {
  try {
    const twiml = new twilio.twiml.VoiceResponse();
    const digit = req.body.Digits;
    const callSid = req.body.CallSid;
    const language = req.query.lang || 'hi';

    const voiceConfig = {
      voice: language === 'hi' ? 'Google.hi-IN-Standard-A' : 'Google.en-IN-Standard-A',
      language: language === 'hi' ? 'hi-IN' : 'en-IN'
    };

    // Update call state
    await IVRCall.findOneAndUpdate(
      { callSid },
      { 
        currentState: `main_menu_${digit}`,
        $push: { actions: { state: 'main_menu', input: digit } }
      }
    );

    if (digit === '1') {
      // Job search flow
      const gather = twiml.gather({
        numDigits: 1,
        action: `/api/ivr/city-selection?lang=${language}`,
        method: 'POST'
      });
      gather.say(voiceConfig, IVR_PROMPTS.citySelection[language]);
      
    } else if (digit === '2') {
      // Legal help
      const gather = twiml.gather({
        numDigits: 1,
        action: `/api/ivr/legal-help?lang=${language}`,
        method: 'POST'
      });
      gather.say(voiceConfig, IVR_PROMPTS.legalHelp[language]);
      
    } else if (digit === '3') {
      // Loan information
      const gather = twiml.gather({
        numDigits: 1,
        action: `/api/ivr/loan-info?lang=${language}`,
        method: 'POST'
      });
      gather.say(voiceConfig, IVR_PROMPTS.loanInfo[language]);
      
    } else if (digit === '0') {
      // Transfer to agent
      const transferMsg = language === 'hi' 
        ? 'आपको अब एजेंट से जोड़ा जा रहा है। कृपया प्रतीक्षा करें।'
        : 'Connecting you to an agent. Please wait.';
      twiml.say(voiceConfig, transferMsg);
      // In production, add: twiml.dial(process.env.AGENT_PHONE_NUMBER);
      twiml.say(voiceConfig, language === 'hi' 
        ? 'क्षमा करें, एजेंट अभी उपलब्ध नहीं हैं।' 
        : 'Sorry, no agents available right now.');
      
    } else {
      // Invalid input
      twiml.say(voiceConfig, IVR_PROMPTS.invalidInput[language]);
      twiml.redirect(`/api/ivr/main-menu?lang=${language}`);
    }

    res.type('text/xml');
    res.send(twiml.toString());
  } catch (error) {
    console.error('Main menu error:', error);
    res.status(500).send('Error');
  }
});

// Handle city selection for job search
app.post('/api/ivr/city-selection', async (req, res) => {
  try {
    const twiml = new twilio.twiml.VoiceResponse();
    const digit = req.body.Digits;
    const callSid = req.body.CallSid;
    const language = req.query.lang || 'hi';

    const city = CITIES[digit];
    const voiceConfig = {
      voice: language === 'hi' ? 'Google.hi-IN-Standard-A' : 'Google.en-IN-Standard-A',
      language: language === 'hi' ? 'hi-IN' : 'en-IN'
    };

    if (!city) {
      twiml.say(voiceConfig, IVR_PROMPTS.invalidInput[language]);
      twiml.redirect(`/api/ivr/main-menu?lang=${language}`);
      res.type('text/xml');
      return res.send(twiml.toString());
    }

    // Update call with selected city
    await IVRCall.findOneAndUpdate(
      { callSid },
      { 
        selectedCity: city,
        currentState: 'job_type_selection',
        $push: { actions: { state: 'city_selection', input: digit, response: city } }
      }
    );

    // Ask for job type
    const gather = twiml.gather({
      numDigits: 1,
      action: `/api/ivr/job-search?lang=${language}&city=${city}`,
      method: 'POST'
    });
    gather.say(voiceConfig, IVR_PROMPTS.jobTypeSelection[language]);

    res.type('text/xml');
    res.send(twiml.toString());
  } catch (error) {
    console.error('City selection error:', error);
    res.status(500).send('Error');
  }
});

// Handle job search and read out jobs
app.post('/api/ivr/job-search', async (req, res) => {
  try {
    const twiml = new twilio.twiml.VoiceResponse();
    const digit = req.body.Digits;
    const callSid = req.body.CallSid;
    const language = req.query.lang || 'hi';
    const city = req.query.city;

    const jobType = JOB_TYPES[digit];
    const voiceConfig = {
      voice: language === 'hi' ? 'Google.hi-IN-Standard-A' : 'Google.en-IN-Standard-A',
      language: language === 'hi' ? 'hi-IN' : 'en-IN'
    };

    if (!jobType) {
      twiml.say(voiceConfig, IVR_PROMPTS.invalidInput[language]);
      twiml.redirect(`/api/ivr/city-selection?lang=${language}`);
      res.type('text/xml');
      return res.send(twiml.toString());
    }

    // Update call
    await IVRCall.findOneAndUpdate(
      { callSid },
      { 
        selectedJobType: jobType,
        currentState: 'reading_jobs',
        $push: { actions: { state: 'job_type_selection', input: digit, response: jobType } }
      }
    );

    // Search for jobs
    const jobs = await Job.find({ 
      location: city,
      $or: [
        { title: new RegExp(jobType, 'i') },
        { description: new RegExp(jobType, 'i') }
      ]
    }).limit(3);

    if (jobs.length === 0) {
      twiml.say(voiceConfig, IVR_PROMPTS.noJobs[language]);
      twiml.pause({ length: 1 });
      twiml.redirect(`/api/ivr/main-menu?lang=${language}`);
    } else {
      // Read out jobs
      const introMsg = language === 'hi'
        ? `${jobs.length} नौकरियां मिलीं। सुनिए:`
        : `Found ${jobs.length} jobs. Here they are:`;
      
      twiml.say(voiceConfig, introMsg);
      twiml.pause({ length: 1 });

      jobs.forEach((job, index) => {
        const jobTitle = language === 'hi' ? job.titleHi || job.title : job.title;
        const jobMsg = language === 'hi'
          ? `नौकरी ${index + 1}. ${jobTitle} ${job.company} में। सैलरी ${job.salary}।`
          : `Job ${index + 1}. ${jobTitle} at ${job.company}. Salary ${job.salary}.`;
        
        twiml.say(voiceConfig, jobMsg);
        twiml.pause({ length: 1 });
      });

      const nextMsg = language === 'hi'
        ? 'इन नौकरियों के लिए आवेदन करने के लिए, कृपया हमारी वेबसाइट पर जाएं या हमें कॉल करें। मुख्य मेनू के लिए स्टार दबाएं।'
        : 'To apply for these jobs, please visit our website or call us. Press star for main menu.';
      
      twiml.say(voiceConfig, nextMsg);
      
      const gather = twiml.gather({
        numDigits: 1,
        action: `/api/ivr/post-jobs?lang=${language}`,
        method: 'POST'
      });
    }

    res.type('text/xml');
    res.send(twiml.toString());
  } catch (error) {
    console.error('Job search error:', error);
    res.status(500).send('Error');
  }
});

// Handle post-job actions
app.post('/api/ivr/post-jobs', async (req, res) => {
  const twiml = new twilio.twiml.VoiceResponse();
  const digit = req.body.Digits;
  const language = req.query.lang || 'hi';

  if (digit === '*') {
    twiml.redirect(`/api/ivr/main-menu?lang=${language}`);
  } else {
    twiml.redirect(`/api/ivr/main-menu?lang=${language}`);
  }

  res.type('text/xml');
  res.send(twiml.toString());
});

// Handle legal help menu
app.post('/api/ivr/legal-help', async (req, res) => {
  try {
    const twiml = new twilio.twiml.VoiceResponse();
    const digit = req.body.Digits;
    const language = req.query.lang || 'hi';
    const callSid = req.body.CallSid;

    const voiceConfig = {
      voice: language === 'hi' ? 'Google.hi-IN-Standard-A' : 'Google.en-IN-Standard-A',
      language: language === 'hi' ? 'hi-IN' : 'en-IN'
    };

    await IVRCall.findOneAndUpdate(
      { callSid },
      { 
        currentState: 'legal_help',
        $push: { actions: { state: 'legal_help', input: digit } }
      }
    );

    let response = '';
    if (digit === '1') {
      response = language === 'hi'
        ? 'न्यूनतम मजदूरी 2025 में राज्य अनुसार 178 से 600 रुपये प्रतिदिन है। अपने राज्य की जानकारी के लिए हमारी वेबसाइट देखें।'
        : 'Minimum wage in 2025 ranges from 178 to 600 rupees per day depending on state. Visit our website for your state information.';
    } else if (digit === '2') {
      response = language === 'hi'
        ? 'कानूनी काम के घंटे दिन में 8 घंटे हैं। ओवरटाइम के लिए डबल वेतन मिलना चाहिए।'
        : 'Legal working hours are 8 hours per day. Overtime should be paid at double rate.';
    } else if (digit === '3') {
      response = language === 'hi'
        ? 'आपको सुरक्षा उपकरण, चिकित्सा सुविधा और दुर्घटना बीमा का अधिकार है। अधिक जानकारी के लिए हमसे संपर्क करें।'
        : 'You have right to safety equipment, medical facilities and accident insurance. Contact us for more information.';
    } else {
      twiml.say(voiceConfig, IVR_PROMPTS.invalidInput[language]);
      twiml.redirect(`/api/ivr/legal-help?lang=${language}`);
      res.type('text/xml');
      return res.send(twiml.toString());
    }

    twiml.say(voiceConfig, response);
    twiml.pause({ length: 2 });
    
    const returnMsg = language === 'hi'
      ? 'मुख्य मेनू के लिए स्टार दबाएं।'
      : 'Press star for main menu.';
    twiml.say(voiceConfig, returnMsg);
    
    const gather = twiml.gather({
      numDigits: 1,
      action: `/api/ivr/return-to-menu?lang=${language}`,
      method: 'POST'
    });

    res.type('text/xml');
    res.send(twiml.toString());
  } catch (error) {
    console.error('Legal help error:', error);
    res.status(500).send('Error');
  }
});

// Handle loan information
app.post('/api/ivr/loan-info', async (req, res) => {
  try {
    const twiml = new twilio.twiml.VoiceResponse();
    const digit = req.body.Digits;
    const language = req.query.lang || 'hi';
    const callSid = req.body.CallSid;

    const voiceConfig = {
      voice: language === 'hi' ? 'Google.hi-IN-Standard-A' : 'Google.en-IN-Standard-A',
      language: language === 'hi' ? 'hi-IN' : 'en-IN'
    };

    await IVRCall.findOneAndUpdate(
      { callSid },
      { 
        currentState: 'loan_info',
        $push: { actions: { state: 'loan_info', input: digit } }
      }
    );

    let response = '';
    if (digit === '1') {
      response = language === 'hi'
        ? 'लोन पात्रता: आपकी उम्र 18 से 60 के बीच होनी चाहिए, आधार कार्ड और बैंक खाता जरूरी है। 5000 से 1 लाख तक का लोन मिल सकता है।'
        : 'Loan eligibility: Age must be between 18 to 60, Aadhaar card and bank account required. Loan amount from 5000 to 1 lakh rupees.';
    } else if (digit === '2') {
      response = language === 'hi'
        ? 'लोन के प्रकार: तत्काल लोन, आपातकालीन लोन, और व्यवसाय लोन उपलब्ध हैं। ब्याज दर 10 से 18 प्रतिशत तक।'
        : 'Loan types: Instant loan, Emergency loan, and Business loan available. Interest rate from 10 to 18 percent.';
    } else if (digit === '3') {
      response = language === 'hi'
        ? 'आवेदन प्रक्रिया: हमारी वेबसाइट पर जाएं, फॉर्म भरें, दस्तावेज अपलोड करें। 24 से 48 घंटे में अप्रूवल मिलेगा।'
        : 'Application process: Visit our website, fill form, upload documents. Approval within 24 to 48 hours.';
    } else {
      twiml.say(voiceConfig, IVR_PROMPTS.invalidInput[language]);
      twiml.redirect(`/api/ivr/loan-info?lang=${language}`);
      res.type('text/xml');
      return res.send(twiml.toString());
    }

    twiml.say(voiceConfig, response);
    twiml.pause({ length: 2 });
    
    const returnMsg = language === 'hi'
      ? 'मुख्य मेनू के लिए स्टार दबाएं।'
      : 'Press star for main menu.';
    twiml.say(voiceConfig, returnMsg);
    
    const gather = twiml.gather({
      numDigits: 1,
      action: `/api/ivr/return-to-menu?lang=${language}`,
      method: 'POST'
    });

    res.type('text/xml');
    res.send(twiml.toString());
  } catch (error) {
    console.error('Loan info error:', error);
    res.status(500).send('Error');
  }
});

// Handle return to menu
app.post('/api/ivr/return-to-menu', async (req, res) => {
  const twiml = new twilio.twiml.VoiceResponse();
  const digit = req.body.Digits;
  const language = req.query.lang || 'hi';

  if (digit === '*') {
    twiml.redirect(`/api/ivr/main-menu?lang=${language}`);
  } else {
    const voiceConfig = {
      voice: language === 'hi' ? 'Google.hi-IN-Standard-A' : 'Google.en-IN-Standard-A',
      language: language === 'hi' ? 'hi-IN' : 'en-IN'
    };
    twiml.say(voiceConfig, IVR_PROMPTS.goodbye[language]);
    twiml.hangup();
  }

  res.type('text/xml');
  res.send(twiml.toString());
});

// Handle call status updates (Twilio callback)
app.post('/api/ivr/status', async (req, res) => {
  try {
    const callSid = req.body.CallSid;
    const callStatus = req.body.CallStatus;
    const duration = req.body.CallDuration;

    await IVRCall.findOneAndUpdate(
      { callSid },
      { 
        callStatus,
        duration: parseInt(duration) || 0,
        endTime: callStatus === 'completed' ? new Date() : undefined
      }
    );

    res.sendStatus(200);
  } catch (error) {
    console.error('Status update error:', error);
    res.sendStatus(500);
  }
});

// Get IVR call history (for admin dashboard)
app.get('/api/ivr/call-history', async (req, res) => {
  try {
    const calls = await IVRCall.find()
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(calls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get IVR analytics
app.get('/api/ivr/analytics', async (req, res) => {
  try {
    const totalCalls = await IVRCall.countDocuments();
    const completedCalls = await IVRCall.countDocuments({ callStatus: 'completed' });
    const averageDuration = await IVRCall.aggregate([
      { $match: { duration: { $exists: true, $gt: 0 } } },
      { $group: { _id: null, avgDuration: { $avg: '$duration' } } }
    ]);

    const languageStats = await IVRCall.aggregate([
      { $group: { _id: '$language', count: { $sum: 1 } } }
    ]);

    const cityStats = await IVRCall.aggregate([
      { $match: { selectedCity: { $exists: true } } },
      { $group: { _id: '$selectedCity', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      totalCalls,
      completedCalls,
      averageDuration: averageDuration[0]?.avgDuration || 0,
      languageDistribution: languageStats,
      popularCities: cityStats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// END OF IVR ENDPOINTS
// ============================================

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});