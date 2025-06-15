import random

class Ticket:
    """
    Tambola ticket class that generates a standard 3x9 ticket with 15 numbers.
    Each column contains numbers from specific ranges:
    Col 1: 1-9, Col 2: 10-19, ..., Col 9: 80-90
    """
    
    def __init__(self, player_name="Player"):
        self.player_name = player_name
        self.grid = [[0 for _ in range(9)] for _ in range(3)]  # 3x9 grid
        self.marked = [[False for _ in range(9)] for _ in range(3)]  # Track marked numbers
        self.generate_ticket()
    
    def generate_ticket(self):
        """Generate a valid Tambola ticket with 15 numbers distributed across 3 rows"""
        # Define number ranges for each column
        column_ranges = [
            (1, 9), (10, 19), (20, 29), (30, 39), (40, 49),
            (50, 59), (60, 69), (70, 79), (80, 90)
        ]
        
        # Generate numbers for each column
        all_numbers = []
        for col in range(9):
            start, end = column_ranges[col]
            # Get 1-3 numbers from each column range
            count = random.randint(1, 3)
            numbers = random.sample(range(start, end + 1), min(count, end - start + 1))
            for num in numbers:
                all_numbers.append((num, col))
        
        # Ensure we have exactly 15 numbers
        while len(all_numbers) < 15:
            col = random.randint(0, 8)
            start, end = column_ranges[col]
            num = random.randint(start, end)
            if (num, col) not in all_numbers:
                all_numbers.append((num, col))
        
        if len(all_numbers) > 15:
            all_numbers = random.sample(all_numbers, 15)
        
        # Distribute numbers across 3 rows (5 numbers per row)
        random.shuffle(all_numbers)
        
        # Place 5 numbers in each row
        for row in range(3):
            row_numbers = all_numbers[row * 5:(row + 1) * 5]
            # Sort by column to maintain proper placement
            row_numbers.sort(key=lambda x: x[1])
            
            # Place numbers in their respective columns
            for num, col in row_numbers:
                self.grid[row][col] = num
    
    def mark_number(self, number):
        """Mark a number on the ticket if it exists"""
        for row in range(3):
            for col in range(9):
                if self.grid[row][col] == number:
                    self.marked[row][col] = True
                    return True
        return False
    
    def display(self):
        """Display the ticket in a readable format"""
        print(f"\n{self.player_name}'s Ticket:")
        print("+" + "-" * 37 + "+")
        
        for row in range(3):
            print("|", end="")
            for col in range(9):
                if self.grid[row][col] == 0:
                    print("    ", end="|")
                else:
                    marker = "X" if self.marked[row][col] else " "
                    print(f"{self.grid[row][col]:2}{marker} ", end="|")
            print()
        
        print("+" + "-" * 37 + "+")
    
    def get_numbers(self):
        """Get all numbers on the ticket"""
        numbers = []
        for row in range(3):
            for col in range(9):
                if self.grid[row][col] != 0:
                    numbers.append(self.grid[row][col])
        return numbers
    
    def get_row_numbers(self, row_index):
        """Get all numbers in a specific row"""
        return [num for num in self.grid[row_index] if num != 0]
    
    def get_corner_numbers(self):
        """Get the four corner numbers"""
        corners = []
        # Find first and last non-zero numbers in first and last rows
        for row in [0, 2]:  # First and last row
            row_numbers = [(col, num) for col, num in enumerate(self.grid[row]) if num != 0]
            if row_numbers:
                corners.append(row_numbers[0][1])  # First number
                corners.append(row_numbers[-1][1])  # Last number
        return corners
