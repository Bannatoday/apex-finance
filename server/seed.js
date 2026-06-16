require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const BlogPost = require('./models/BlogPost');
const connectDB = require('./config/db');

const seedData = async () => {
  try {
    await connectDB();
    console.log('🌱 Starting seed...\n');

    // Create admin user
    const existingAdmin = await Admin.findOne({ email: 'admin@apexfinancellc.com' });
    if (!existingAdmin) {
      const admin = new Admin({
        name: 'Admin User',
        email: 'admin@apexfinancellc.com',
        password: 'admin123456',
        role: 'super_admin'
      });
      await admin.save();
      console.log('✅ Admin user created:');
      console.log('   Email: admin@apexfinancellc.com');
      console.log('   Password: admin123456');
      console.log('   ⚠️  Change this password after first login!\n');
    } else {
      console.log('ℹ️  Admin user already exists.\n');
    }

    // Create sample blog posts
    const existingPosts = await BlogPost.countDocuments();
    if (existingPosts === 0) {
      const posts = [
        {
          title: '5 Tips to Improve Your Credit Score Before Applying for a Loan',
          slug: '5-tips-improve-credit-score',
          content: `<h2>Why Your Credit Score Matters</h2>
<p>Your credit score is one of the most important factors lenders consider when evaluating your loan application. A higher credit score can help you secure better interest rates and more favorable loan terms.</p>

<h2>1. Check Your Credit Report for Errors</h2>
<p>Start by requesting a free copy of your credit report from all three major bureaus. Look for any inaccuracies, such as accounts you don't recognize or incorrect payment statuses. Dispute any errors you find, as they could be dragging down your score.</p>

<h2>2. Pay Down Existing Debt</h2>
<p>Your credit utilization ratio — the amount of credit you're using compared to your total available credit — accounts for about 30% of your credit score. Try to keep your utilization below 30%, and ideally below 10%.</p>

<h2>3. Make All Payments on Time</h2>
<p>Payment history is the single most important factor in your credit score. Set up automatic payments or reminders to ensure you never miss a due date. Even one late payment can significantly impact your score.</p>

<h2>4. Don't Close Old Credit Accounts</h2>
<p>The length of your credit history matters. Keep older accounts open, even if you're not actively using them, as they contribute positively to your credit age.</p>

<h2>5. Limit New Credit Applications</h2>
<p>Each hard inquiry on your credit report can lower your score by a few points. Avoid applying for multiple credit cards or loans in a short period before your loan application.</p>

<h2>Ready to Apply?</h2>
<p>Once you've taken steps to improve your credit score, you'll be in a much stronger position to apply for a loan with competitive rates. Contact Apex Finance LLC today to discuss your options.</p>`,
          excerpt: 'Learn actionable strategies to boost your credit score and increase your chances of loan approval with better rates.',
          category: 'credit-score',
          tags: ['credit score', 'loan tips', 'financial planning'],
          author: 'Sarah Mitchell',
          status: 'published',
          publishedAt: new Date('2024-11-15'),
          seo: {
            metaTitle: '5 Tips to Improve Credit Score | Apex Finance LLC',
            metaDescription: 'Discover 5 proven strategies to improve your credit score before applying for a loan. Get better rates and approval chances.'
          }
        },
        {
          title: 'Personal Loans vs. Credit Cards: Which Is Right for You?',
          slug: 'personal-loans-vs-credit-cards',
          content: `<h2>Understanding Your Borrowing Options</h2>
<p>When you need to borrow money, two of the most common options are personal loans and credit cards. Each has its own advantages and disadvantages, and the right choice depends on your specific financial situation.</p>

<h2>When to Choose a Personal Loan</h2>
<p>Personal loans are ideal for larger, one-time expenses. They offer fixed interest rates, predictable monthly payments, and defined repayment terms. Consider a personal loan when:</p>
<ul>
<li>You need to borrow $1,000 or more</li>
<li>You want a fixed repayment schedule</li>
<li>You're consolidating high-interest debt</li>
<li>You have a specific project or expense to fund</li>
</ul>

<h2>When to Choose a Credit Card</h2>
<p>Credit cards offer flexibility and convenience for everyday purchases and smaller expenses. They're best when:</p>
<ul>
<li>You can pay off the balance each month</li>
<li>You want to earn rewards on purchases</li>
<li>You need ongoing access to credit</li>
<li>You're making smaller, regular purchases</li>
</ul>

<h2>Interest Rate Comparison</h2>
<p>Personal loans typically offer lower interest rates than credit cards, especially for borrowers with good credit. While the average credit card APR hovers around 20-25%, personal loan rates can range from 6-15% for qualified borrowers.</p>

<h2>The Bottom Line</h2>
<p>Consider a personal loan for larger expenses with a clear repayment plan, and use credit cards for everyday purchases you can pay off monthly. At Apex Finance LLC, we can help you find the right personal loan for your needs.</p>`,
          excerpt: 'Compare personal loans and credit cards to determine which borrowing option best fits your financial needs and goals.',
          category: 'loan-tips',
          tags: ['personal loans', 'credit cards', 'borrowing'],
          author: 'James Richardson',
          status: 'published',
          publishedAt: new Date('2024-11-20'),
          seo: {
            metaTitle: 'Personal Loans vs Credit Cards | Apex Finance',
            metaDescription: 'Compare personal loans and credit cards. Learn which option saves you more money based on your financial situation.'
          }
        },
        {
          title: 'A First-Time Borrower\'s Complete Guide to Getting a Loan',
          slug: 'first-time-borrower-guide',
          content: `<h2>Your First Loan: What You Need to Know</h2>
<p>Applying for your first loan can feel overwhelming, but understanding the process can help ease your anxiety. This comprehensive guide walks you through everything you need to know as a first-time borrower.</p>

<h2>Step 1: Assess Your Financial Situation</h2>
<p>Before applying for any loan, take stock of your finances. Calculate your monthly income, existing expenses, and how much you can comfortably afford in monthly payments. A good rule of thumb is that your total debt payments shouldn't exceed 36% of your gross monthly income.</p>

<h2>Step 2: Check Your Credit Score</h2>
<p>Your credit score plays a crucial role in loan approval and interest rates. You can check your score for free through various online services. Scores generally range from 300-850, with 670+ considered "good."</p>

<h2>Step 3: Research Loan Types</h2>
<p>Different loan types serve different purposes. Personal loans, auto loans, mortgage loans, and student loans each have unique terms and requirements. Make sure you're applying for the right type of loan for your needs.</p>

<h2>Step 4: Gather Your Documents</h2>
<p>Most lenders will require proof of identity and income, including government-issued ID, recent pay stubs, bank statements, and tax returns. Having these ready can speed up the application process.</p>

<h2>Step 5: Compare Lenders</h2>
<p>Don't settle for the first offer you receive. Compare rates, terms, and fees from multiple lenders. A loan broker like Apex Finance LLC can help you compare options from multiple lenders with just one application.</p>

<h2>Start Your Journey Today</h2>
<p>Ready to apply for your first loan? Apex Finance LLC makes the process simple and stress-free. Our team of experts will guide you every step of the way.</p>`,
          excerpt: 'Everything first-time borrowers need to know about getting a loan — from checking your credit to comparing lenders.',
          category: 'first-time-borrowers',
          tags: ['first-time borrower', 'loan guide', 'getting started'],
          author: 'Emily Chen',
          status: 'published',
          publishedAt: new Date('2024-12-01'),
          seo: {
            metaTitle: 'First-Time Borrower Guide | Apex Finance LLC',
            metaDescription: 'Complete guide for first-time borrowers. Learn how to prepare, apply, and get approved for your first loan.'
          }
        },
        {
          title: 'Small Business Loans: How to Fund Your Startup in 2025',
          slug: 'small-business-loans-2025',
          content: `<h2>Funding Your Business Dream</h2>
<p>Starting a business requires capital, and for many entrepreneurs, a small business loan is the key to turning their vision into reality. Here's what you need to know about securing business funding in 2025.</p>

<h2>Types of Business Loans Available</h2>
<p>The business lending landscape offers several options:</p>
<ul>
<li><strong>SBA Loans:</strong> Government-backed loans with competitive rates</li>
<li><strong>Term Loans:</strong> Lump sum with fixed repayment schedule</li>
<li><strong>Lines of Credit:</strong> Flexible, revolving credit access</li>
<li><strong>Equipment Financing:</strong> Loans specifically for business equipment</li>
<li><strong>Invoice Factoring:</strong> Advance on outstanding invoices</li>
</ul>

<h2>What Lenders Look For</h2>
<p>Business lenders evaluate several factors including your business plan, revenue projections, personal credit score, business credit history, collateral, and industry experience.</p>

<h2>Preparing Your Application</h2>
<p>A strong business loan application includes a detailed business plan, financial projections, tax returns, bank statements, and legal documents like your business license and articles of incorporation.</p>

<h2>Let Us Help</h2>
<p>Navigating business financing can be complex. Apex Finance LLC connects entrepreneurs with the right lenders for their specific business needs.</p>`,
          excerpt: 'Discover the best options for funding your startup or small business in 2025, from SBA loans to lines of credit.',
          category: 'business-financing',
          tags: ['business loans', 'startup funding', 'SBA loans'],
          author: 'Michael Torres',
          status: 'published',
          publishedAt: new Date('2024-12-10'),
          seo: {
            metaTitle: 'Small Business Loans 2025 | Apex Finance LLC',
            metaDescription: 'Explore small business loan options for 2025. SBA loans, term loans, lines of credit, and more for startups.'
          }
        },
        {
          title: 'Understanding Mortgage Rates: Fixed vs. Adjustable',
          slug: 'understanding-mortgage-rates',
          content: `<h2>Choosing the Right Mortgage Rate</h2>
<p>One of the biggest decisions you'll make when getting a mortgage is choosing between a fixed-rate and an adjustable-rate mortgage (ARM). This choice can significantly impact your monthly payments and the total cost of your home loan.</p>

<h2>Fixed-Rate Mortgages</h2>
<p>With a fixed-rate mortgage, your interest rate stays the same for the entire life of the loan. This means your principal and interest payment will never change, making it easier to budget.</p>
<p><strong>Best for:</strong> Borrowers who plan to stay in their home for a long time and prefer payment stability.</p>

<h2>Adjustable-Rate Mortgages (ARMs)</h2>
<p>ARMs start with a lower initial rate that adjusts periodically based on market conditions. Common structures include 5/1, 7/1, and 10/1 ARMs, where the first number indicates years of fixed rate.</p>
<p><strong>Best for:</strong> Borrowers who plan to sell or refinance within the initial fixed period, or those who expect rates to decrease.</p>

<h2>Current Market Outlook</h2>
<p>In today's market, it's important to consider economic forecasts when choosing your rate type. Consult with a loan professional to understand how current trends might affect your decision.</p>

<h2>Get Expert Guidance</h2>
<p>The mortgage experts at Apex Finance LLC can help you understand your options and choose the rate structure that best fits your financial goals. Apply today for a free consultation.</p>`,
          excerpt: 'Learn the key differences between fixed and adjustable mortgage rates to make the best decision for your home purchase.',
          category: 'market-updates',
          tags: ['mortgage', 'interest rates', 'home buying'],
          author: 'Sarah Mitchell',
          status: 'published',
          publishedAt: new Date('2024-12-15'),
          seo: {
            metaTitle: 'Fixed vs Adjustable Mortgage Rates | Apex Finance',
            metaDescription: 'Understand the difference between fixed and adjustable mortgage rates. Make an informed decision for your home loan.'
          }
        },
        {
          title: 'Debt Consolidation: Is It the Right Move for You?',
          slug: 'debt-consolidation-guide',
          content: `<h2>What Is Debt Consolidation?</h2>
<p>Debt consolidation combines multiple debts into a single loan, ideally with a lower interest rate. This strategy can simplify your finances and potentially save you money on interest payments.</p>

<h2>How It Works</h2>
<p>You take out a new loan to pay off multiple existing debts — credit cards, medical bills, personal loans, etc. Instead of making multiple payments each month, you make just one payment to the new lender.</p>

<h2>Benefits of Debt Consolidation</h2>
<ul>
<li><strong>Lower interest rate:</strong> Often significantly lower than credit card rates</li>
<li><strong>Single monthly payment:</strong> Easier to manage and track</li>
<li><strong>Fixed repayment timeline:</strong> Know exactly when you'll be debt-free</li>
<li><strong>Improved credit score:</strong> Lower utilization and consistent payments help</li>
</ul>

<h2>When It Makes Sense</h2>
<p>Debt consolidation works best when you have multiple high-interest debts, can qualify for a lower rate, and are committed to not accumulating new debt. It's not a magic solution — it requires discipline.</p>

<h2>Take the First Step</h2>
<p>If you're juggling multiple debts and want to simplify your finances, Apex Finance LLC can help you find the right debt consolidation loan. Apply today for a free assessment.</p>`,
          excerpt: 'Explore how debt consolidation works and whether combining your debts into one loan could save you money and stress.',
          category: 'loan-tips',
          tags: ['debt consolidation', 'debt management', 'financial wellness'],
          author: 'Emily Chen',
          status: 'published',
          publishedAt: new Date('2024-12-20'),
          seo: {
            metaTitle: 'Debt Consolidation Guide | Apex Finance LLC',
            metaDescription: 'Is debt consolidation right for you? Learn how combining debts into one loan can lower payments and simplify finances.'
          }
        }
      ];

      await BlogPost.insertMany(posts);
      console.log(`✅ ${posts.length} blog posts created.\n`);
    } else {
      console.log(`ℹ️  ${existingPosts} blog posts already exist.\n`);
    }

    console.log('🎉 Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();
