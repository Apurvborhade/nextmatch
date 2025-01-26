import { Users, Calendar, Trophy, Search } from "lucide-react"

const features = [
  {
    name: "Find Teammates",
    description: "Connect with players in your area and form the perfect team.",
    icon: Users,
  },
  {
    name: "Join Matches",
    description: "Discover and participate in local football matches and tournaments.",
    icon: Calendar,
  },
  {
    name: "Create Teams",
    description: "Build and manage your own football team with like-minded players.",
    icon: Trophy,
  },
  {
    name: "Player Search",
    description: "Find players based on position, skill level, and availability.",
    icon: Search,
  },
]

export default function Features() {
  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {features.map((feature) => (
            <div key={feature.name} className="flex flex-col items-center text-center p-4 bg-secondary rounded-lg">
              <div className="mb-4 rounded-full bg-primary p-3 text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold">{feature.name}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

