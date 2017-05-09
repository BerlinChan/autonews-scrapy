# Use an official Python runtime as a base image
FROM python:3.6.1

# Set the working directory to /app
WORKDIR /

# Copy the current directory contents into the container at /app
ADD ./autonews /autonews
ADD ./requirements.txt /
ADD ./scrapy.cfg /
ADD ./scrapy_scheduler.py /

# Install any needed packages specified in requirements.txt
RUN pip install -r requirements.txt

# Make port 80 available to the world outside this container
#EXPOSE 80

# Define environment variable
ENV NAME autonews-scrapy

# Run app.py when the container launches
CMD ["python", "scrapy_scheduler.py"]