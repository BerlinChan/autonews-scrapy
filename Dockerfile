# Use an official Python runtime as a base image
FROM python:3.6.1

# Set the working directory to /app
WORKDIR /autonews

# Copy the current directory contents into the container at /app
ADD ./autonews /autonews
ADD ./requirements.txt /autonews
ADD ./scrapy.cfg /autonews
ADD ./scrapy_scheduler.py /autonews

# install java
ADD ./autonews/lib/jre-6u45-linux-x64.bin /opt
RUN chmod +x /opt/jre-6u45-linux-x64.bin
RUN /opt/jre-6u45-linux-x64.bin
RUN rm /opt/jre-6u45-linux-x64.bin
RUN update-alternatives --install /usr/bin/java java /opt/jre1.6.0_45/bin/java 100

# Install any needed packages specified in requirements.txt
RUN pip install -r requirements.txt

# Make port 80 available to the world outside this container
#EXPOSE 80

# Define environment variable
ENV NAME autonews-scrapy

# Run app.py when the container launches
CMD ["python", "./autonews/scrapy_scheduler.py"]