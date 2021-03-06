class AlertSimple
  class << self
    def job_saved(job)
      print(' √ '.green)
    end

    def already_saved
      print(' ↓ '.light_blue)
    end

    def prime
      print(' → '.yellow)
    end

    def on_page(number)
      print("\nPage: #{number} ".magenta)
    end

    def timeout(_)
      print(' X '.red.on_white)
    end

    def bad_position(_)
      print(' → '.red)
    end

    def start_search(position, location)
      puts("Searching #{position} @ #{location} ".magenta)
    end
  end
end