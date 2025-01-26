import Image from "next/image"

const testimonials = [
  {
    name: "Alex Johnson",
    role: "Amateur Player",
    content: "NextMatch helped me find an amazing team in my area. Now I play regularly and have made great friends!",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "Sarah Lee",
    role: "Team Captain",
    content:
      "Managing my team has never been easier. NextMatch streamlines everything from player recruitment to match scheduling.",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "Mike Brown",
    role: "Tournament Organizer",
    content:
      "NextMatch has revolutionized how we organize local tournaments. It's a game-changer for the football community.",
    avatar: "/placeholder.svg?height=100&width=100",
  },
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">What Players Say</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="flex flex-col items-center text-center bg-secondary p-6 rounded-lg">
              <Image
                src={testimonial.avatar || "/placeholder.svg"}
                alt={testimonial.name}
                width={100}
                height={100}
                className="rounded-full mb-4"
              />
              <blockquote className="mb-4 text-lg italic">&ldquo;{testimonial.content}&rdquo;</blockquote>
              <cite className="font-bold">{testimonial.name}</cite>
              <p className="text-sm text-muted-foreground">{testimonial.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

