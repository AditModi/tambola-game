import random
import time

class Caller:
    """
    Tambola caller class that manages the number calling process
    """
    
    def __init__(self):
        self.numbers = list(range(1, 91))  # Numbers 1-90
        random.shuffle(self.numbers)
        self.called_numbers = []
        self.current_index = 0
    
    def call_next_number(self):
        """Call the next number in the sequence"""
        if self.current_index < len(self.numbers):
            number = self.numbers[self.current_index]
            self.called_numbers.append(number)
            self.current_index += 1
            return number
        return None
    
    def get_called_numbers(self):
        """Get list of all called numbers"""
        return self.called_numbers.copy()
    
    def has_more_numbers(self):
        """Check if there are more numbers to call"""
        return self.current_index < len(self.numbers)
    
    def get_remaining_count(self):
        """Get count of remaining numbers"""
        return len(self.numbers) - self.current_index
    
    def display_called_numbers(self):
        """Display all called numbers in a formatted way"""
        if not self.called_numbers:
            print("No numbers called yet.")
            return
        
        print(f"\nCalled Numbers ({len(self.called_numbers)}):")
        print("-" * 50)
        
        # Display in rows of 10
        for i in range(0, len(self.called_numbers), 10):
            row = self.called_numbers[i:i+10]
            print(" ".join(f"{num:2}" for num in row))
        print("-" * 50)
    
    def announce_number(self, number):
        """Announce a number with some flair"""
        announcements = {
            1: "Kelly's Eye, Number One!",
            2: "One Little Duck, Number Two!",
            11: "Legs Eleven!",
            22: "Two Little Ducks, Twenty-Two!",
            77: "Sunset Strip, Seventy-Seven!",
            88: "Two Fat Ladies, Eighty-Eight!",
            90: "Top of the Shop, Ninety!"
        }
        
        if number in announcements:
            print(f"🎯 {announcements[number]}")
        else:
            print(f"🎯 Number {number}!")
    
    def reset(self):
        """Reset the caller for a new game"""
        self.numbers = list(range(1, 91))
        random.shuffle(self.numbers)
        self.called_numbers = []
        self.current_index = 0
