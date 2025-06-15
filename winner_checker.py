class WinnerChecker:
    """
    Class to check for various winning patterns in Tambola
    """
    
    def __init__(self):
        self.winning_patterns = {
            'first_line': 'First Line',
            'second_line': 'Second Line', 
            'third_line': 'Third Line',
            'four_corners': 'Four Corners',
            'full_house': 'Full House'
        }
    
    def check_line_win(self, ticket, row_index):
        """Check if a specific line/row is complete"""
        for col in range(9):
            if ticket.grid[row_index][col] != 0 and not ticket.marked[row_index][col]:
                return False
        return True
    
    def check_four_corners(self, ticket):
        """Check if all four corners are marked"""
        corners_positions = []
        
        # Find corner positions for first and last rows
        for row in [0, 2]:
            row_positions = [(col, ticket.grid[row][col]) for col in range(9) if ticket.grid[row][col] != 0]
            if len(row_positions) >= 2:
                # First and last positions in the row
                corners_positions.append((row, row_positions[0][0]))  # First
                corners_positions.append((row, row_positions[-1][0]))  # Last
        
        # Check if all corner positions are marked
        if len(corners_positions) == 4:
            for row, col in corners_positions:
                if not ticket.marked[row][col]:
                    return False
            return True
        return False
    
    def check_full_house(self, ticket):
        """Check if all numbers on the ticket are marked"""
        for row in range(3):
            for col in range(9):
                if ticket.grid[row][col] != 0 and not ticket.marked[row][col]:
                    return False
        return True
    
    def check_all_wins(self, ticket):
        """Check all possible winning patterns and return list of wins"""
        wins = []
        
        # Check line wins
        for row in range(3):
            if self.check_line_win(ticket, row):
                line_names = ['first_line', 'second_line', 'third_line']
                wins.append(line_names[row])
        
        # Check four corners
        if self.check_four_corners(ticket):
            wins.append('four_corners')
        
        # Check full house
        if self.check_full_house(ticket):
            wins.append('full_house')
        
        return wins
    
    def get_win_description(self, win_type):
        """Get human-readable description of win type"""
        return self.winning_patterns.get(win_type, win_type)
    
    def check_new_wins(self, ticket, previous_wins):
        """Check for new wins since last check"""
        current_wins = self.check_all_wins(ticket)
        new_wins = [win for win in current_wins if win not in previous_wins]
        return new_wins, current_wins
    
    def display_win_announcement(self, player_name, win_types):
        """Display win announcement"""
        if not win_types:
            return
        
        print("\n" + "🎉" * 50)
        print(f"🏆 WINNER ALERT! 🏆")
        print(f"Player: {player_name}")
        
        for win_type in win_types:
            print(f"🎯 {self.get_win_description(win_type)}")
        
        print("🎉" * 50 + "\n")
    
    def get_prize_hierarchy(self):
        """Get the typical prize hierarchy in Tambola"""
        return [
            ('first_line', 'First Line - Quick Five'),
            ('second_line', 'Second Line'),
            ('third_line', 'Third Line'),
            ('four_corners', 'Four Corners'),
            ('full_house', 'Full House - Jackpot!')
        ]
