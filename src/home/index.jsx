import { UserButton } from "@clerk/clerk-react";
import React from "react";
import Header from "../components/custom/Header";
import { Button } from "../components/ui/button";
import { Link } from 'react-router-dom'

function Home() {
    return (
        <div> 
            <Header />
            <main className="container mx-auto px-4 py-8">
                <section className="hero text-center py-16">
                    <h1 className="text-4xl font-bold mb-4">Create Your AI-Generated Resume</h1>
                    <p className="text-lg mb-8">Generate professional resumes effortlessly with our AI-powered tool.</p>
                    <Link to={'/dashboard'}>
                        <Button size="lg">Get Started</Button>
                    </Link>
                </section>
                <section className="features grid grid-cols-1 md:grid-cols-3 gap-8 py-16">
                    <div className="feature text-center">
                        <h2 className="text-2xl font-bold mb-4">AI-Powered</h2>
                        <p>Leverage the power of AI to create a resume that stands out.</p>
                    </div>
                    <div className="feature text-center">
                        <h2 className="text-2xl font-bold mb-4">Easy to Use</h2>
                        <p>Our user-friendly interface makes resume creation a breeze.</p>
                    </div>
                    <div className="feature text-center">
                        <h2 className="text-2xl font-bold mb-4">Customizable</h2>
                        <p>Customize your resume to match your personal style and preferences.</p>
                    </div>
                </section>
                <section className="cta text-center py-16">
                    <h2 className="text-3xl font-bold mb-4">Ready to Create Your Resume?</h2>
                    <Link to={'/dashboard'}>
                        <Button size="lg">Get Started Now</Button>
                    </Link>
                </section>
            </main>
            <footer className="text-center py-8">
                <p>&copy; {new Date().getFullYear()} AI Resume Generator. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default Home;
